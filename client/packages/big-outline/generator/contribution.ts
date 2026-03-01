/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import type { LangiumDeclaration, UmlToolingContributionResult } from '@borkdominik-biguml/uml-language-tooling';
import { Eta } from 'eta';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function umlToolingContribution(extensionPath: string, declarations: LangiumDeclaration[]): UmlToolingContributionResult {
    const generatedFiles: { path: string; content: string }[] = [];

    // Initialize Eta with the templates directory
    const eta = new Eta({ views: path.join(__dirname, 'templates') });

    // Load the template
    const templatePath = path.join(__dirname, 'templates', 'outline-action-handler.eta');
    const templateContent = fs.readFileSync(templatePath, 'utf-8');

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
        const astImport = `import { ${guardNames} } from '@borkdominik-biguml/uml-model-server/grammar';`;

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

        // Render the template with Eta
        const content = eta.renderString(templateContent, {
            shortKey,
            className,
            typeValue,
            fullKey,
            astImport,
            cases
        });

        generatedFiles.push({ path: extensionPath + `/glsp-server/handlers/${fileName}`, content });
    }

    return { files: generatedFiles };
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
