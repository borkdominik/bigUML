/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import fs from 'fs';
import path from 'path';
import { type LangiumDeclaration } from '../types/index.js';

export function writePropertyPaletteHandlers(extensionPath: string, declarations: LangiumDeclaration[]): void {
    // ─── generate individual handlers ─────────────────────────────
    const elemsOut = path.join(extensionPath, 'yo-generated', 'property-palette', 'elements');
    if (!fs.existsSync(elemsOut)) fs.mkdirSync(elemsOut, { recursive: true });

    const nodes = getNodeDecls(declarations);
    nodes.forEach(decl => {
        const fp = path.join(elemsOut, `${decl.name}PropertyPaletteHandler.ts`);
        fs.writeFileSync(fp, renderHandler(decl), 'utf8');
        console.log(`Generated property-palette handler: ${fp}`);
    });

    // ─── generate the central dispatcher ─────────────────────────
    writeRequestPropertyPaletteHandlers(extensionPath, declarations);
}

function getNodeDecls(decls: LangiumDeclaration[]) {
    return decls.filter(
        d =>
            d.type === 'class' &&
            !d.isAbstract &&
            d.name !== 'Diagram' &&
            !d.name!.endsWith('Diagram') &&
            (d.extends ?? []).every(e => e !== 'Relation') &&
            d.name !== 'Relation' &&
            d.name !== 'Entity' &&
            d.name !== 'ElementWithSizeAndPosition' &&
            !(d.extends ?? []).includes('MetaInfo')
    );
}

function renderHandler(decl: LangiumDeclaration): string {
    const name = decl.name!;
    // gather all dynamicProperty TypeNames for this decl
    const dynamicTypes = Array.from(
        new Set(
            decl.properties?.flatMap(p => p.decorators?.filter(d => d.startsWith('dynamicProperty:')).map(d => d.split(':')[1]) ?? []) ?? []
        )
    );

    // build signature extras: e.g. ", dataTypeChoices, definingFeatureChoices"
    const sigExtras = dynamicTypes.map(t => `, ${lcFirst(t)}Choices`).join('');

    const body =
        decl.properties
            ?.map(p => emitBuilderLine(p, decl))
            .filter(Boolean)
            .join('\n') ?? '';

    const usesCreateDelete = /CreateNodeOperation|DeleteElementOperation/.test(body);
    const usesModelTypes = /ModelTypes\./.test(body);

    const glspImport = usesCreateDelete ? `\nimport { CreateNodeOperation, DeleteElementOperation } from '@eclipse-glsp/server';` : '';
    const modelTypesImport = usesModelTypes ? `\nimport { ModelTypes } from '../../../../glsp-server/util/model-types.js';` : '';

    return `// AUTO-GENERATED – DO NOT EDIT

import { SetPropertyPaletteAction } from '@borkdominik-biguml/biguml-protocol';${glspImport}
import { ${name} } from '../../../../language-server/generated/ast.js';${modelTypesImport}
import { PropertyPalette } from '../../../util/property-palette-util.js';

export namespace ${name}PropertyPaletteHandler {
  export function getPropertyPalette(
    semanticElement: ${name}${sigExtras}
  ): SetPropertyPaletteAction[] {
    return [
      SetPropertyPaletteAction.create(
        PropertyPalette.builder()
          .elementId(semanticElement.__id)
          .label(semanticElement.$type)
${body}
          .build()
      )
    ];
  }
}
`;
}

function emitBuilderLine(prop: any, _decl: LangiumDeclaration): string | undefined {
    // skip explicit skipPropertyPP
    if (prop.decorators?.includes('skipPropertyPP')) return;

    // dynamicProperty:TypeName → generic .choice(...)
    const dyn = prop.decorators?.find((d: any) => d.startsWith('dynamicProperty:'));
    if (dyn) {
        const typeName = dyn.split(':')[1];
        const id = prop.name;
        const choicesVar = `${lcFirst(typeName)}Choices`;
        return `    .choice(
            semanticElement.__id,
            '${id}',
            ${choicesVar},
            semanticElement.${id}?.ref?.__id + '_refValue',
            '${human(id)}'
          )`;
    }

    // skip any other crossReference / constants / entities
    if (prop.decorators?.includes('crossReference')) return;
    if (prop.types?.[0]?.type === 'constant') return;
    if (prop.name === 'entities') return;

    const id = prop.name;
    const first = prop.types?.[0];
    const mult = prop.multiplicity;

    if (mult === '*') {
        const typeName = first?.typeName ?? 'Element';
        const modelConst = toConst(typeName);
        const label = human(typeName);
        return `      .reference(
            semanticElement.__id,
            '${id}',
            '${human(id)}',
            (semanticElement.${id} ?? []).map(e => ({
              elementId: e.__id,
              label: e.name,
              name:  e.name,
              deleteActions: [DeleteElementOperation.create([e.__id])]
            })),
            [{
              label: 'Create ${label}',
              action: CreateNodeOperation.create(ModelTypes.${modelConst}, { containerId: semanticElement.__id })
            }]
          )`;
    }

    if (first?.typeName === 'boolean') {
        return `          .bool(semanticElement.__id, '${id}', semanticElement.${id}, '${id}')`;
    }

    if (first?.typeName === 'string' || first?.typeName === 'number') {
        const val = first.typeName === 'number' ? `String(semanticElement.${id})` : `semanticElement.${id}`;
        return `          .text(semanticElement.__id, '${id}', ${val}, '${human(id)}')`;
    }

    const constant = optionConstant(first?.typeName ?? '');
    if (constant) {
        return `        .choice(
            semanticElement.__id,
            '${id}',
            PropertyPalette.${constant},
            semanticElement.${id},
            '${human(first!.typeName)}'
          )`;
    }

    return;
}

export function writeRequestPropertyPaletteHandlers(extensionPath: string, declarations: LangiumDeclaration[]): void {
    // ─── make sure the output dir exists ──────────────────────────────────────────
    const outDir = path.join(extensionPath, 'yo-generated', 'property-palette');
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    // ─── helper: find all type-aliases ending with "DiagramElements" ─────────────
    const diagramAliases = declarations.filter(d => d.type === 'type' && d.name?.endsWith('DiagramElements'));

    // ─── prepare a map of all concrete Entity subclasses ─────────────────────────
    const allEntities = getNodeDecls(declarations);

    // ─── for each diagramElements alias, generate one handler file ───────────────
    for (const alias of diagramAliases) {
        const fullKey = alias.name!.replace(/Elements$/, ''); // e.g. "ClassDiagram"
        const shortKey = fullKey.replace(/Diagram$/, ''); // → "Class"
        const fileName = `request-${lcFirst(shortKey)}-property-palette-action-handler.ts`;
        const className = `Request${shortKey}PropertyPaletteActionHandler`;
        const modelStateClass = `${shortKey}DiagramModelState`;
        const modelStateImportPath = `../../../glsp-server/${lcFirst(shortKey)}-diagram/model/${lcFirst(shortKey)}-diagram-model-state.js`;

        // ─── gather the union members: e.g. ["Class","Interface",…] ────────────────
        const members = alias.properties?.[0]?.types.map(t => t.typeName).filter(Boolean) as string[];

        // ─── filter only those entities that belong to this diagram ────────────────
        const nodes = allEntities.filter(e => members.includes(e.name!));

        // ─── build single import for all guards ────────────────────────────────────
        const guardNames = nodes
            .map(d => `is${d.name}`)
            .sort()
            .join(', ');
        const astImport = `import { ${guardNames} } from '../../../language-server/generated/ast.js';`;

        // ─── build imports for each per-type handler ───────────────────────────────
        const handlerImports = nodes
            .map(d => d.name!)
            .sort()
            .map(n => `import { ${n}PropertyPaletteHandler } from './elements/${n}PropertyPaletteHandler.js';`)
            .join('\n');

        // ─── collect all dynamic types across these nodes ───────────────────────────
        const allDyn = Array.from(
            new Set(
                nodes.flatMap(
                    d =>
                        d.properties?.flatMap(
                            p => p.decorators?.filter(d => d.startsWith('dynamicProperty:')).map(d => d.split(':')[1]) ?? []
                        ) ?? []
                )
            )
        );

        // ─── build the code that creates each <lowerFirst>Choices array ─────────────
        const dynamicBuilders = allDyn
            .map(typeName => {
                const varName = `${lcFirst(typeName)}Choices`;
                const indexCall = `getAll${typeName}s`;
                return `    const ${varName} = this.modelState.index.${indexCall}().map((item) => ({
      label: item.name,
      value: item.__id + '_refValue',
      secondaryText: item.$type
    }));`;
            })
            .join('\n');

        // ─── build dispatch chain passing only needed choice arrays ────────────────
        const dispatchChain = nodes
            .map(d => {
                const dynForDecl = Array.from(
                    new Set(
                        d.properties?.flatMap(
                            p => p.decorators?.filter(d => d.startsWith('dynamicProperty:')).map(d => d.split(':')[1]) ?? []
                        ) ?? []
                    )
                );
                const args = ['semanticElement'].concat(dynForDecl.map(t => lcFirst(t) + 'Choices')).join(', ');
                return `    } else if (is${d.name}(semanticElement)) {
      return ${d.name}PropertyPaletteHandler.getPropertyPalette(${args});
`;
            })
            .join('');

        // ─── assemble the handler source ───────────────────────────────────────────
        const content = `// AUTO-GENERATED – DO NOT EDIT
/*********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { RequestPropertyPaletteAction, SetPropertyPaletteAction } from '@borkdominik-biguml/biguml-protocol';
import { ActionHandler, MaybePromise } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
${astImport}
import { ${modelStateClass} } from '${modelStateImportPath}';
${handlerImports}

@injectable()
export class ${className} implements ActionHandler {
  actionKinds = [RequestPropertyPaletteAction.KIND];

  @inject(${modelStateClass})
  protected modelState!: ${modelStateClass};

  execute(action: RequestPropertyPaletteAction): MaybePromise<any[]> {
    if (!action.elementId) {
      return [SetPropertyPaletteAction.create()];
    }
    const semanticElement = this.modelState.index.findIdElement(action.elementId);
    if (!semanticElement) {
      return [SetPropertyPaletteAction.create()];
    }

${dynamicBuilders}

    if (false) {
${dispatchChain}    }
    return [SetPropertyPaletteAction.create()];
  }
}
`;

        fs.writeFileSync(path.join(outDir, fileName), content, 'utf8');
        console.log(`Generated ${fileName}`);
    }
}

// utilities
function optionConstant(typeName: string): string | undefined {
    const map: Record<string, string> = {
        Visibility: 'DEFAULT_VISIBILITY_CHOICES',
        AggregationType: 'DEFAULT_AGGREGATION_CHOICES',
        Concurrency: 'DEFAULT_CONCURRENCY_CHOICES',
        ParameterDirection: 'DEFAULT_PARAMETER_DIRECTION_CHOICES',
        EffectType: 'DEFAULT_EFFECT_CHOICES'
    };
    return map[typeName];
}

const WORD_BREAK = /([a-z0-9])([A-Z])/g;
const toConst = (s: string) => s.replace(WORD_BREAK, '$1_$2').toUpperCase();
const human = (s: string) => s.replace(WORD_BREAK, '$1 $2').replace(/^\w/, c => c.toUpperCase());
const lcFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
