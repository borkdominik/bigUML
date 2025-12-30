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

export function writeRequestOutlineActionHandlers(extensionPath: string, declarations: LangiumDeclaration[]): void {
    // ─── make sure the output dir exists ──────────────────────────────────────────
    const outDir = path.join(extensionPath, 'yo-generated', 'outline');
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    // ─── helper: find all type-aliases ending with "DiagramElements" ─────────────
    const diagramAliases = declarations.filter(d => d.type === 'type' && d.name?.endsWith('DiagramElements'));

    // ─── prepare a map of all concrete Entity subclasses ─────────────────────────
    const allEntities = getEntityDecls(declarations);

    // ─── for each diagramElements alias, generate one handler file ───────────────
    for (const alias of diagramAliases) {
        const fullKey = alias.name!.replace(/Elements$/, ''); // e.g. "ClassDiagram"
        const shortKey = fullKey.replace(/Diagram$/, ''); // → "Class"
        const fileName = `request-${lcFirst(shortKey)}-outline-action-handler.ts`;
        const className = `Request${shortKey}OutlineActionHandler`;
        const typeValue = fullKey
            .replace(/Diagram$/, '') // "Class"
            .replace(/([a-z])([A-Z])/g, '$1_$2') // "Class" → "Class"
            .toUpperCase(); // → "CLASS"

        // gather the union members: e.g. ["Enumeration","Class","Interface",…]
        const members = alias.properties?.[0]?.types.map(t => t.typeName).filter(Boolean) as string[];
        // filter only those entities that belong to this diagram
        const nodes = allEntities.filter(e => members.includes(e.name!));
        // build the import of isX guards
        const guardNames = nodes.map(d => `is${d.name}`).join(', ');
        const astImport = `import { ${guardNames} } from '../../../language-server/generated/ast.js';`;

        // build the per-class cases
        const cases = nodes
            .map(d => {
                const iconClass = d.name!.toLowerCase();
                const guard = `is${d.name}`;
                const lines: string[] = [`      if (${guard}(entity)) {`, `        node.iconClass = '${iconClass}';`];

                // for each *-multiplicity prop, map its children
                (d.properties ?? [])
                    .filter(p => p.multiplicity === '*')
                    .forEach(p => {
                        const childIcon = p.types[0].typeName!.toLowerCase();
                        lines.push(
                            `        node.children.push(` +
                                `\n          ...(entity.${p.name} ?? []).map(child => ({` +
                                `\n            label: child.name,` +
                                `\n            semanticUri: child.__id,` +
                                `\n            children: [],` +
                                `\n            iconClass: '${childIcon}'` +
                                `\n          }))\n        );`
                        );
                    });

                lines.push(`      }`);
                return lines.join('\n');
            })
            .join('\n\n');

        // assemble the handler source
        const content = `// AUTO-GENERATED – DO NOT EDIT
/*********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { RequestOutlineAction, SetOutlineAction } from '@borkdominik-biguml/biguml-protocol';
import { ActionHandler, MaybePromise } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
${astImport}
import { ${shortKey}DiagramModelState } from '../../../glsp-server/${lcFirst(shortKey)}-diagram/model/${lcFirst(shortKey)}-diagram-model-state.js';

@injectable()
export class ${className} implements ActionHandler {
  actionKinds = [RequestOutlineAction.KIND];

  @inject(${shortKey}DiagramModelState)
  protected modelState!: ${shortKey}DiagramModelState;

  execute(action: RequestOutlineAction): MaybePromise<any[]> {
    // only ${fullKey} outlines
    if (this.modelState.semanticRoot.diagram.diagramType !== '${typeValue}') {
      return [ SetOutlineAction.create({ outlineTreeNodes: [] }) ];
    }
    const root = this.modelState.semanticRoot.diagram;
    const outlineTreeNodes = [
      {
        label: 'Model',
        semanticUri: root.__id,
        children: [],
        iconClass: 'model',
        isRoot: true
      }
    ];
    const entities = root.entities ?? [];
    entities.forEach(entity => {
      const node: any = {
        label: entity.name,
        semanticUri: entity.__id,
        children: [],
        iconClass: 'element'
      };

${cases}

      outlineTreeNodes[0].children.push(node);
    });
    return [ SetOutlineAction.create({ outlineTreeNodes }) ];
  }
}
`;

        // write it out
        fs.writeFileSync(path.join(outDir, fileName), content, 'utf8');
        console.log(`Generated ${fileName}`);
    }
}

/**
 * Return only concrete classes that (transitively) extend `Entity`.
 */
function getEntityDecls(decls: LangiumDeclaration[]): LangiumDeclaration[] {
    const map = new Map(decls.map(d => [d.name, d]));
    function inherits(name: string): boolean {
        const d = map.get(name);
        if (!d || !d.extends) return false;
        if (d.extends.includes('Entity')) return true;
        return d.extends.some(p => inherits(p));
    }
    return decls.filter(d => d.type === 'class' && !d.isAbstract && inherits(d.name!));
}

function lcFirst(s: string): string {
    return s.charAt(0).toLowerCase() + s.slice(1);
}
