/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { type Declaration, getDiagramDeclarations, toKebab } from '@borkdominik-biguml/uml-language-tooling';
import { Eta } from 'eta';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const eta = new Eta({ views: path.join(__dirname, '..', 'templates') });

// ============================================================================
// Types
// ============================================================================

interface DiagramRegistryEntry {
    /** `Class`, `StateMachine`, ... - the prefix of every generated class of the diagram. */
    name: string;
    /** `class`, `state-machine`, ... - the folder and file prefix of the diagram's generated files. */
    kebab: string;
    /** The literal stored in the diagram's `diagramType` property - `CLASS`, `STATE_MACHINE`, ... */
    diagramType: string;
    /** The AST type of the diagram itself - `ClassDiagram`, `StateMachineDiagram`, ... */
    astType: string;
}

// ============================================================================
// Main entry point
// ============================================================================

/**
 * Renders the one list of every diagram there is, so that the server's wiring iterates it instead
 * of naming each diagram by hand wherever a per-diagram class is needed.
 */
export function renderDiagramRegistry(extensionPath: string, declarations: Declaration[]): { path: string; content: string }[] {
    const diagrams: DiagramRegistryEntry[] = getDiagramDeclarations(declarations).map(decl => {
        const name = decl.name!.replace(/Diagram$/, '');
        return { name, kebab: toKebab(name), diagramType: diagramTypeLiteral(decl), astType: decl.name! };
    });

    const content = eta.render('./diagram-registry', { diagrams });

    return [
        {
            path: path.join(extensionPath, 'vscode', 'diagram-registry.ts'),
            content
        }
    ];
}

// ============================================================================
// Helpers
// ============================================================================

function diagramTypeLiteral(decl: Declaration): string {
    const constant = decl.properties?.find(p => p.name === 'diagramType')?.types.find(t => t.type === 'constant');
    if (!constant) {
        throw new Error(`[diagram-registry] '${decl.name}' declares no 'diagramType' literal`);
    }
    return constant.typeName.replace(/^"|"$/g, '');
}
