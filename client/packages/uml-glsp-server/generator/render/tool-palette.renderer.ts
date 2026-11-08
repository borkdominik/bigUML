/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
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

export function renderToolPaletteItemProvider(extensionPath: string, declarations: Declaration[]): { path: string; content: string }[] {
    const results: { path: string; content: string }[] = [];

    const diagramDecls = getDiagramDeclarations(declarations);

    for (const diagramDecl of diagramDecls) {
        const diagramName = diagramDecl.name!.replace(/Diagram$/, '');

        const nodeTypeAlias = declarations.find(d => d.type === 'type' && d.name === `${diagramName}DiagramNodes`);
        const edgeTypeAlias = declarations.find(d => d.type === 'type' && d.name === `${diagramName}DiagramEdges`);

        const nodeNames = new Set(extractTypeNames(nodeTypeAlias));
        const edgeNames = new Set(extractTypeNames(edgeTypeAlias));

        const allDiagramNames = new Set([...nodeNames, ...edgeNames]);
        const decoratedDecls = declarations.filter(
            d => Decorator.find(d.decorators, 'toolPalette') !== undefined && allDiagramNames.has(d.name!)
        );

        const sectionMap = new Map<string, ToolPaletteChild[]>();

        for (const decl of decoratedDecls) {
            const options = parseToolPaletteItemDecorator(decl.decorators);
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

function parseToolPaletteItemDecorator(decorators: Decorator[]): ToolPaletteItemOptions | undefined {
    const dec = Decorator.find(decorators, 'toolPalette');
    if (!dec) {
        return undefined;
    }

    const parsed = Decorator.getArg<Record<string, unknown>>(dec);
    if (!parsed || !parsed.section || !parsed.label || !parsed.icon) {
        return undefined;
    }

    return {
        section: parsed.section as string,
        label: parsed.label as string,
        icon: parsed.icon as string,
        id: parsed.id as string | undefined
    };
}
