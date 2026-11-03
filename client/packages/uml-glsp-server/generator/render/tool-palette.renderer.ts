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
    section?: string;
    label: string;
    icon: string;
}

interface ToolPaletteChild {
    id: string;
    label: string;
    icon: string;
    constName: string;
}

interface ToolPaletteSection {
    id: string;
    label: string;
    children: ToolPaletteChild[];
}

/** A relation of the diagram, offered by the "Create relation" tool rather than listed in a section. */
interface RelationTypeEntry {
    label: string;
    icon: string;
    constName: string;
}

interface ToolPaletteTemplateData {
    diagramName: string;
    modelTypesFileName: string;
    sections: ToolPaletteSection[];
    relationTypes: RelationTypeEntry[];
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
        const relationTypes: RelationTypeEntry[] = [];

        for (const decl of decoratedDecls) {
            const options = parseToolPaletteItemDecorator(decl.decorators);
            if (!options) {
                continue;
            }

            const constName = toConstant(decl.name!);

            // A relation is not listed in a section: the "Create relation" tool offers it once both of its
            // ends are picked, and only where its `source` and `target` references admit them.
            if (edgeNames.has(decl.name!)) {
                if (options.section !== undefined) {
                    throw new Error(
                        `[tool-palette] Relation '${decl.name}' declares the section '${options.section}'. ` +
                            'Relations are offered by the "Create relation" tool and take no section.'
                    );
                }
                relationTypes.push({ label: options.label, icon: options.icon, constName });
                continue;
            }

            if (options.section === undefined) {
                throw new Error(`[tool-palette] Node '${decl.name}' declares no section to be listed in.`);
            }
            if (!sectionMap.has(options.section)) {
                sectionMap.set(options.section, []);
            }
            sectionMap.get(options.section)!.push({
                id: options.id ?? toKebab(decl.name!),
                label: options.label,
                icon: options.icon,
                constName
            });
        }

        const sections: ToolPaletteSection[] = Array.from(sectionMap.entries()).map(([label, children]) => ({
            id: `uml.${toKebab(label)}`,
            label,
            children
        }));

        const data: ToolPaletteTemplateData = {
            diagramName,
            modelTypesFileName: `${toKebab(diagramName)}-diagram-model-types`,
            sections,
            // Listed by name, so the picker reads the same whatever order the definitions are declared in.
            relationTypes: relationTypes.sort((a, b) => a.label.localeCompare(b.label))
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
    if (!parsed || !parsed.label || !parsed.icon) {
        return undefined;
    }

    return {
        section: parsed.section as string | undefined,
        label: parsed.label as string,
        icon: parsed.icon as string,
        id: parsed.id as string | undefined
    };
}
