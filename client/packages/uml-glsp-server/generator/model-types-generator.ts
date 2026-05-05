/*********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import type { LangiumDeclaration } from '@borkdominik-biguml/uml-language-tooling';
import { Eta } from 'eta';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const eta = new Eta({ views: path.join(__dirname, 'templates') });

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

export function buildModelTypes(extensionPath: string, declarations: LangiumDeclaration[]): { path: string; content: string }[] {
    const results: { path: string; content: string }[] = [];

    const diagramDecls = declarations.filter(d => d.type === 'class' && d.name !== 'Diagram' && d.name?.endsWith('Diagram'));

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

function extractTypeNames(typeDecl: LangiumDeclaration | undefined): string[] {
    if (!typeDecl?.properties?.[0]?.types) {
        return [];
    }
    return typeDecl.properties[0].types.map(t => t.typeName).filter(Boolean) as string[];
}

function isAbstractOrBase(decl: LangiumDeclaration): boolean {
    return !!decl.isAbstract || decl.name === 'Relation' || decl.name === 'Entity';
}

function buildEntries(declarations: LangiumDeclaration[], names: string[]): ModelTypeEntry[] {
    const entries: ModelTypeEntry[] = [];

    for (const name of names) {
        const decl = declarations.find(d => d.name === name);
        if (!decl) {
            continue;
        }

        if (isAbstractOrBase(decl)) {
            continue;
        }

        const astTypeDecorator = decl.decorators?.find(d => d.startsWith('astType:'));
        const astName = astTypeDecorator ? astTypeDecorator.split(':')[1] : name;

        let template: string | undefined;
        if (astTypeDecorator) {
            template = toKebab(name).replace(/-/g, '');
            template = name.charAt(0).toLowerCase() + name.slice(1);
            template = template.toLowerCase();
        }

        entries.push({
            constName: toConstant(name),
            astName,
            template
        });
    }

    return entries;
}

function buildAstAliases(
    declarations: LangiumDeclaration[],
    allNames: string[],
    nodes: ModelTypeEntry[],
    edges: ModelTypeEntry[]
): AstAlias[] {
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
        const astTypeDecorator = decl.decorators?.find(d => d.startsWith('astType:'));
        if (astTypeDecorator) {
            const astName = astTypeDecorator.split(':')[1];
            aliases.push({ constName, astName });
            continue;
        }

        // If a class's parent is also in the list with same name pattern
        // (e.g., AbstractClass extends Class → both map to 'Class')
        if (decl.extends) {
            for (const parent of decl.extends) {
                if (allNames.includes(parent) && parent !== name) {
                    const parentDecl = declarations.find(d => d.name === parent);
                    if (parentDecl && !parentDecl.decorators?.find(d => d.startsWith('astType:'))) {
                        aliases.push({ constName, astName: parent });
                    }
                }
            }
        }
    }

    return aliases;
}

const WORD_BREAK = /([a-z0-9])([A-Z])/g;
const toConstant = (s: string) => s.replace(WORD_BREAK, '$1_$2').toUpperCase();
const toKebab = (s: string) => s.replace(WORD_BREAK, '$1-$2').toLowerCase();
