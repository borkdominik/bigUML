/*********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import {
    type Declaration,
    Decorator,
    extractTypeNames,
    getDiagramDeclarations,
    toConstant,
    toKebab
} from '@borkdominik-biguml/uml-language-tooling';
import { Eta } from 'eta';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const eta = new Eta({ views: path.join(__dirname, '..', 'templates') });

// ============================================================================
// Types
// ============================================================================

interface ModelTypeEntry {
    constName: string;
    astName: string;
    template?: string;
}

interface AstAlias {
    constName: string;
    astName: string;
}

interface ModelTypesTemplateData {
    diagramName: string;
    representation: string;
    nodes: ModelTypeEntry[];
    edges: ModelTypeEntry[];
    astAliases: AstAlias[];
}

// ============================================================================
// Main entry point
// ============================================================================

export function renderModelTypes(extensionPath: string, declarations: Declaration[]): { path: string; content: string }[] {
    const results: { path: string; content: string }[] = [];

    const diagramDecls = getDiagramDeclarations(declarations);

    for (const diagramDecl of diagramDecls) {
        const diagramName = diagramDecl.name!.replace(/Diagram$/, '');

        const nodeTypeAlias = declarations.find(d => d.type === 'type' && d.name === `${diagramName}DiagramNodes`);
        const edgeTypeAlias = declarations.find(d => d.type === 'type' && d.name === `${diagramName}DiagramEdges`);

        const nodeNames = extractTypeNames(nodeTypeAlias);
        const edgeNames = extractTypeNames(edgeTypeAlias);

        const nodes = buildEntries(declarations, nodeNames);
        const edges = buildEntries(declarations, edgeNames);

        const astAliases = buildAstAliases(declarations, [...nodeNames, ...edgeNames], nodes, edges);

        const data: ModelTypesTemplateData = {
            diagramName,
            representation: diagramName,
            nodes,
            edges,
            astAliases
        };

        const content = eta.render('./model-types', data);

        const outDir = path.join(extensionPath, 'common', 'model-types');
        const fileName = `${toKebab(diagramName)}-diagram-model-types.ts`;
        results.push({ path: path.join(outDir, fileName), content });
    }

    return results;
}

// ============================================================================
// Helpers
// ============================================================================

function buildEntries(declarations: Declaration[], names: string[]): ModelTypeEntry[] {
    const entries: ModelTypeEntry[] = [];

    for (const name of names) {
        const decl = declarations.find(d => d.name === name);
        if (!decl) {
            continue;
        }

        if (decl.isAbstract) {
            continue;
        }

        const aliasDec = Decorator.find(decl.decorators, 'alias');
        const astName = aliasDec ? (Decorator.getArg<string>(aliasDec) ?? name) : name;

        let template: string | undefined;
        if (aliasDec) {
            template = name.toLowerCase();
        }

        entries.push({
            constName: toConstant(name),
            astName,
            template
        });
    }

    return entries;
}

function buildAstAliases(declarations: Declaration[], allNames: string[], nodes: ModelTypeEntry[], edges: ModelTypeEntry[]): AstAlias[] {
    const aliases: AstAlias[] = [];
    const allEntries = [...nodes, ...edges];

    for (const name of allNames) {
        const decl = declarations.find(d => d.name === name);
        if (!decl) {
            continue;
        }

        const constName = toConstant(name);
        const entry = allEntries.find(e => e.constName === constName);
        if (!entry) {
            continue;
        }

        // If the class extends another class that maps to a different AST type,
        // we need an alias
        const aliasDec = Decorator.find(decl.decorators, 'alias');
        if (aliasDec) {
            const astName = Decorator.getArg<string>(aliasDec) ?? name;
            aliases.push({ constName, astName });
            continue;
        }

        // If a class's parent is also in the list with same name pattern
        // (e.g., AbstractClass extends Class → both map to 'Class')
        if (decl.extends) {
            for (const parent of decl.extends) {
                if (allNames.includes(parent) && parent !== name) {
                    const parentDecl = declarations.find(d => d.name === parent);
                    if (parentDecl && !Decorator.find(parentDecl.decorators, 'alias')) {
                        aliases.push({ constName, astName: parent });
                    }
                }
            }
        }
    }

    return aliases;
}
