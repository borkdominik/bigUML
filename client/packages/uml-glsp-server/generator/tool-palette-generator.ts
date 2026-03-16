/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
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

interface ToolPaletteItemOptions {
    id?: string;
    section: string;
    label: string;
    icon: string;
}

interface ToolPaletteChild {
    id: string;
    label: string;
    icon: string;
    isEdge: boolean;
    constName: string;
}

interface ToolPaletteSection {
    id: string;
    label: string;
    children: ToolPaletteChild[];
}

interface ToolPaletteTemplateData {
    diagramName: string;
    modelTypesFileName: string;
    sections: ToolPaletteSection[];
    hasNodes: boolean;
    hasEdges: boolean;
}

// ============================================================================
// Main entry point
// ============================================================================

export function buildToolPaletteItemProvider(
    extensionPath: string,
    declarations: LangiumDeclaration[]
): { path: string; content: string }[] {
    const results: { path: string; content: string }[] = [];

    const diagramDecls = declarations.filter(d => d.type === 'class' && d.name !== 'Diagram' && d.name?.endsWith('Diagram'));

    for (const diagramDecl of diagramDecls) {
        const diagramName = diagramDecl.name!.replace(/Diagram$/, '');

        const nodeTypeAlias = declarations.find(d => d.type === 'type' && d.name === `${diagramName}DiagramNodes`);
        const edgeTypeAlias = declarations.find(d => d.type === 'type' && d.name === `${diagramName}DiagramEdges`);

        const nodeNames = new Set(extractTypeNames(nodeTypeAlias));
        const edgeNames = new Set(extractTypeNames(edgeTypeAlias));

        const allDiagramNames = new Set([...nodeNames, ...edgeNames]);
        const decoratedDecls = declarations.filter(
            d => d.decorators?.some(dec => dec.startsWith('toolPaletteItem:')) && allDiagramNames.has(d.name!)
        );

        const sectionMap = new Map<string, ToolPaletteChild[]>();

        for (const decl of decoratedDecls) {
            const options = parseToolPaletteItemDecorator(decl.decorators!);
            if (!options) {
                continue;
            }

            const isEdge = edgeNames.has(decl.name!);
            const id = options.id ?? toKebab(decl.name!);

            const child: ToolPaletteChild = {
                id,
                label: options.label,
                icon: options.icon,
                isEdge,
                constName: toConstant(decl.name!)
            };

            if (!sectionMap.has(options.section)) {
                sectionMap.set(options.section, []);
            }
            sectionMap.get(options.section)!.push(child);
        }

        const sections: ToolPaletteSection[] = Array.from(sectionMap.entries()).map(([label, children]) => ({
            id: `uml.${toKebab(label)}`,
            label,
            children
        }));

        const hasNodes = sections.some(s => s.children.some(c => !c.isEdge));
        const hasEdges = sections.some(s => s.children.some(c => c.isEdge));

        const data: ToolPaletteTemplateData = {
            diagramName,
            modelTypesFileName: `${toKebab(diagramName)}-diagram-model-types`,
            sections,
            hasNodes,
            hasEdges
        };

        const content = eta.render('./tool-palette-item-provider', data);

        const outDir = path.join(extensionPath, 'vscode', 'diagram', toKebab(diagramName));
        const fileName = `${toKebab(diagramName)}-diagram-tool-palette-item-provider.ts`;
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

function parseToolPaletteItemDecorator(decorators: string[]): ToolPaletteItemOptions | undefined {
    const dec = decorators.find(d => d.startsWith('toolPaletteItem:'));
    if (!dec) {
        return undefined;
    }

    const json = dec.substring('toolPaletteItem:'.length);

    try {
        const parsed = JSON.parse(json) as Record<string, string>;

        if (!parsed.section || !parsed.label || !parsed.icon) {
            return undefined;
        }

        return {
            section: parsed.section,
            label: parsed.label,
            icon: parsed.icon,
            id: parsed.id
        };
    } catch {
        return undefined;
    }
}

const WORD_BREAK = /([a-z0-9])([A-Z])/g;
const toKebab = (s: string) => s.replace(WORD_BREAK, '$1-$2').toLowerCase();
const toConstant = (s: string) => s.replace(WORD_BREAK, '$1_$2').toUpperCase();
