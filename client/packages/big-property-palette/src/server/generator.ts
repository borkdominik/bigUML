/*********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { type LangiumDeclaration } from '@borkdominik-biguml/model-common';
import fs from 'fs';
import path from 'path';

export function writePropertyPaletteHandlers(
    extensionPath: string,
    declarations: LangiumDeclaration[]
): { path: string; content: string }[] {
    const results: { path: string; content: string }[] = [];

    // ─── generate individual handlers ─────────────────────────────
    const elemsOut = path.join(extensionPath, 'yo-generated', 'property-palette', 'elements');
    if (!fs.existsSync(elemsOut)) fs.mkdirSync(elemsOut, { recursive: true });

    const nodes = getNodeDecls(declarations);
    nodes.forEach(decl => {
        const fp = path.join(elemsOut, `${decl.name}PropertyPaletteHandler.ts`);
        const content = renderHandler(decl);
        results.push({ path: fp, content });
    });

    // ─── generate the central dispatchers ─────────────────────────
    const requestFiles = writeRequestPropertyPaletteHandlers(extensionPath, declarations);
    results.push(...requestFiles);

    return results;
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

    const dynamicTypes = Array.from(
        new Set(
            decl.properties?.flatMap(p => p.decorators?.filter(d => d.startsWith('dynamicProperty:')).map(d => d.split(':')[1]) ?? []) ?? []
        )
    );

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

import { SetPropertyPaletteAction } from '@borkdominik-biguml/uml-protocol';${glspImport}
import { ${name} } from '@borkdominik-biguml/model-server/grammar';${modelTypesImport}
import { PropertyPalette } from '../../../util/property-palette-util.js';

export namespace ${name}PropertyPaletteHandler {
  export function getPropertyPalette(
    semanticElement: ${name}${sigExtras}
  ): SetPropertyPaletteAction[] {
    return [
      SetPropertyPaletteAction.create(
        PropertyPalette.builder()
          .elementId(semanticElement.__id)
          .label((semanticElement as any).name ?? semanticElement.$type)
${body}
          .build()
      )
    ];
  }
}
`;
}

function emitBuilderLine(prop: any, _decl: LangiumDeclaration): string | undefined {
    if (prop.decorators?.includes('skipPropertyPP')) return;

    const dyn = prop.decorators?.find((d: string) => d.startsWith('dynamicProperty:'));
    if (dyn) {
        const typeName = dyn.split(':')[1];
        const id = prop.name;
        const choicesVar = `${lcFirst(typeName)}Choices`;
        return `    .choice(
            semanticElement.__id,
            '${id}',
            ${choicesVar},
            ((semanticElement.${id} as any)?.ref?.__id
            ? (semanticElement.${id} as any).ref.__id + '_refValue'
            : ''),
            '${human(id)}'
          )`;
    }

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
            (semanticElement.${id} ?? [])
              .filter((e: any) => !!e && !!e.__id)
              .map((e: any) => ({
                elementId: e.__id,
                label: e.name ?? '(unnamed ${toConst(first?.typeName ?? 'Element').toLowerCase()})',
                name:  e.name ?? '',
                deleteActions: [DeleteElementOperation.create([e.__id])]
              })),
            [{
              label: 'Create ${label}',
              action: CreateNodeOperation.create(ModelTypes.${modelConst}, { containerId: semanticElement.__id })
            }]
          )`;
    }

    if (first?.typeName === 'boolean') {
        return `          .bool(semanticElement.__id, '${id}', !!semanticElement.${id}, '${id}')`;
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

export function writeRequestPropertyPaletteHandlers(
    extensionPath: string,
    declarations: LangiumDeclaration[]
): { path: string; content: string }[] {
    const results: { path: string; content: string }[] = [];

    const outDir = path.join(extensionPath, 'yo-generated', 'property-palette');
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    const diagramAliases = declarations.filter(d => d.type === 'type' && d.name?.endsWith('DiagramElements'));

    const allEntities = getNodeDecls(declarations);

    for (const alias of diagramAliases) {
        const fullKey = alias.name!.replace(/Elements$/, ''); // e.g. "ClassDiagram"
        const shortKey = fullKey.replace(/Diagram$/, ''); // → "Class"
        const fileName = `request-${lcFirst(shortKey)}-property-palette-action-handler.ts`;
        const className = `Request${shortKey}PropertyPaletteActionHandler`;
        const modelStateClass = `${shortKey}DiagramModelState`;
        const modelStateImportPath = `../../../glsp-server/${lcFirst(shortKey)}-diagram/model/${lcFirst(shortKey)}-diagram-model-state.js`;

        const members = alias.properties?.[0]?.types.map(t => t.typeName).filter(Boolean) as string[];

        const nodes = allEntities.filter(e => members.includes(e.name!));

        const guardNames = nodes
            .map(d => `is${d.name}`)
            .sort()
            .join(', ');
        const astImport = `import { ${guardNames} } from '@borkdominik-biguml/model-server/grammar';`;

        const handlerImports = nodes
            .map(d => d.name!)
            .sort()
            .map(n => `import { ${n}PropertyPaletteHandler } from './elements/${n}PropertyPaletteHandler.js';`)
            .join('\n');

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

        const dynamicBuilders = allDyn
            .map(typeName => {
                const varName = `${lcFirst(typeName)}Choices`;
                const indexCall = `getAll${typeName}s`;
                return `    const ${varName} = (this.modelState.index.${indexCall}?.() ?? [])
          .filter((item: any) => !!item && !!item.__id && !!item.name)
          .map((item: any) => ({
            label: item.name,
            value: item.__id + '_refValue',
            secondaryText: item.$type
          }));`;
            })
            .join('\n');

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

        const content = `// AUTO-GENERATED – DO NOT EDIT
/*********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { RequestPropertyPaletteAction, SetPropertyPaletteAction } from '@borkdominik-biguml/uml-protocol';
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
    try {
      if (!action.elementId) {
        return [SetPropertyPaletteAction.create()];
      }
      if (typeof action.elementId !== 'string' || action.elementId.endsWith('_refValue')) {
        return [SetPropertyPaletteAction.create()];
      }

      let semanticElement: any | undefined;
      try {
        semanticElement = this.modelState.index.findIdElement(action.elementId);
      } catch {
        return [SetPropertyPaletteAction.create()];
      }
      if (!semanticElement) {
        return [SetPropertyPaletteAction.create()];
      }

  ${dynamicBuilders}

      if (false) {
  ${dispatchChain}    }
        return [SetPropertyPaletteAction.create()];
      } catch (_e: unknown) { 
        return [SetPropertyPaletteAction.create()];
      }
    }
  }
`;

        results.push({ path: path.join(outDir, fileName), content });
        console.log(`Generated ${fileName}`);
    }
    return results;
}

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
