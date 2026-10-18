/*********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { type Declaration, lcFirst, resolveTypeAliasMembers, toKebab } from '@borkdominik-biguml/uml-language-tooling';
import { Eta } from 'eta';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { type DynamicProperty, getDynamicProperties, getDynamicPropertyTypes, getNodeDecls } from '../utils/declaration.utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prefixPath = ['glsp-server', 'handlers'];

const eta = new Eta({ views: path.join(__dirname, '..', 'templates') });

export function renderRequestHandler(outputPath: string, declarations: Declaration[]): { path: string; content: string }[] {
    const results: { path: string; content: string }[] = [];

    const outDir = path.join(outputPath, ...prefixPath);
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    const diagramAliases = declarations.filter(d => d.type === 'type' && d.name?.endsWith('DiagramElements'));
    const allEntities = getNodeDecls(declarations);

    for (const alias of diagramAliases) {
        const fullKey = alias.name!.replace(/Elements$/, '');
        const shortKey = fullKey.replace(/Diagram$/, '');
        const fileName = `request-${lcFirst(shortKey)}-property-palette-action-handler.ts`;
        const className = `Request${shortKey}PropertyPaletteActionHandler`;
        const modelStateClass = `DiagramModelState`;
        const modelStateImportPath = `@borkdominik-biguml/uml-glsp-server/vscode`;

        const members = resolveTypeAliasMembers(alias, declarations);
        const nodes = allEntities.filter(e => members.includes(e.name!));

        // The choices of a dynamic property are the elements of the model its declared type admits, so
        // the guards of those types are imported alongside the guards the dispatch needs.
        const dynamicProperties = new Map<string, DynamicProperty>();
        for (const node of nodes) {
            for (const dynamic of getDynamicProperties(node, declarations)) {
                const known = dynamicProperties.get(dynamic.typeName);
                dynamicProperties.set(dynamic.typeName, {
                    typeName: dynamic.typeName,
                    memberTypes: Array.from(new Set([...(known?.memberTypes ?? []), ...dynamic.memberTypes]))
                });
            }
        }
        const dynamicGuards = [...dynamicProperties.values()].flatMap(dynamic => dynamic.memberTypes.map(type => `is${type}`));

        const guardNames = Array.from(new Set([...nodes.map(d => `is${d.name}`), ...dynamicGuards]))
            .sort()
            .join(', ');
        const astImport = [
            `import { ${guardNames} } from '@borkdominik-biguml/uml-model-server/grammar';`,
            ...(dynamicProperties.size > 0
                ? [`import { referenceChoices } from '@borkdominik-biguml/big-property-palette/glsp-server';`]
                : [])
        ].join('\n');

        const handlerImports = nodes
            .map(d => d.name!)
            .sort()
            .map(n => `import { ${n}PropertyPaletteHandler } from './elements/${toKebab(n)}.property-palette-handler.js';`)
            .join('\n');

        const dynamicBuilders = [...dynamicProperties.values()]
            .map(dynamic => {
                const guards = dynamic.memberTypes
                    .map(type => `is${type}`)
                    .sort()
                    .join(', ');
                return `            const ${lcFirst(dynamic.typeName)}Choices = referenceChoices(this.modelState.semanticRoot, [${guards}]);`;
            })
            .join('\n');

        const dispatchEntries = nodes.map(d => {
            const dynForDecl = getDynamicPropertyTypes(d);
            const args = ['context'].concat(dynForDecl.map(t => lcFirst(t) + 'Choices')).join(', ');
            return {
                guard: `is${d.name}`,
                handler: `${d.name}PropertyPaletteHandler`,
                args
            };
        });

        const content = eta.render('./request-property-palette-action-handler', {
            className,
            modelStateClass,
            modelStateImportPath,
            astImport,
            handlerImports,
            dynamicBuilders,
            dispatchEntries
        });

        results.push({ path: path.join(outDir, fileName), content });
    }
    return results;
}
