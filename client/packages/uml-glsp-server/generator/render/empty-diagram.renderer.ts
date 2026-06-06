/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { type Declaration, getDiagramDeclarations } from '@borkdominik-biguml/uml-language-tooling';
import { Eta } from 'eta';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const eta = new Eta({ views: path.join(__dirname, '..', 'templates') });

// ============================================================================
// Types
// ============================================================================

interface EmptyDiagramEntry {
    umlDiagramType: string;
    astType: string;
    diagramTypeLiteral: string;
}

// ============================================================================
// Main entry point
// ============================================================================

export function renderEmptyDiagram(extensionPath: string, declarations: Declaration[]): { path: string; content: string }[] {
    const entries = buildEmptyDiagramEntries(declarations);
    const content = eta.render('./get-empty-diagram', { entries });

    return [
        {
            path: path.join(extensionPath, 'vscode', 'get-empty-diagram.ts'),
            content
        }
    ];
}

// ============================================================================
// Helpers
// ============================================================================

function buildEmptyDiagramEntries(declarations: Declaration[]): EmptyDiagramEntry[] {
    const diagramDecls = getDiagramDeclarations(declarations);
    const entries: EmptyDiagramEntry[] = [];

    for (const decl of diagramDecls) {
        const astType = decl.name!;
        const diagramTypeProp = decl.properties?.find(p => p.name === 'diagramType');
        if (!diagramTypeProp) {
            continue;
        }

        const constantType = diagramTypeProp.types.find(t => t.type === 'constant');
        if (!constantType) {
            continue;
        }

        const diagramTypeLiteral = constantType.typeName.replace(/^"|"$/g, '');
        const umlDiagramType = diagramTypeLiteral.toLowerCase();

        entries.push({ umlDiagramType, astType, diagramTypeLiteral });
    }

    return entries;
}
