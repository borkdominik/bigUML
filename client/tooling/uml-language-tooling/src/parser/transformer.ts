/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { type Declaration } from '../types/index.js';

/**
 * Enriches parsed declarations in place:
 * 1. Merges inherited properties from parent classes.
 * 2. Builds the reverse `extendedBy` mapping.
 * 3. Strips properties from abstract classes (they become union type rules).
 */
export function transformDeclarations(declarations: Array<Declaration>): Array<Declaration> {
    // Sort declarations topologically so parents are processed before children
    const sorted = topologicalSort(declarations);

    // Merge inherited properties (child overrides parent for same-named properties)
    for (const declaration of sorted) {
        if (declaration.extends && declaration.extends.length > 0) {
            for (const extend of declaration.extends) {
                const parent = sorted.find(d => d.name === extend);
                if (parent?.properties) {
                    const ownNames = new Set((declaration.properties ?? []).map(p => p.name));
                    const inherited = parent.properties.filter(p => !ownNames.has(p.name));
                    declaration.properties = [...(declaration.properties ?? []), ...inherited];
                }
            }
        }
        declaration.extendedBy = [];
    }

    // Build extendedBy reverse mapping
    for (const declaration of sorted) {
        if (declaration.extends) {
            for (const extend of declaration.extends) {
                const parent = sorted.find(d => d.name === extend);
                if (parent) {
                    parent.extendedBy!.push(declaration.name!);
                }
            }
        }
    }

    // Strip properties from abstract classes
    for (const declaration of sorted) {
        if (declaration.isAbstract && declaration.type === 'class') {
            declaration.properties = [];
        }
    }

    return sorted;
}

function topologicalSort(declarations: Array<Declaration>): Array<Declaration> {
    const nameToDecl = new Map(declarations.map(d => [d.name, d]));
    const visited = new Set<string>();
    const result: Array<Declaration> = [];

    function visit(decl: Declaration): void {
        if (visited.has(decl.name!)) return;
        visited.add(decl.name!);
        if (decl.extends) {
            for (const parentName of decl.extends) {
                const parent = nameToDecl.get(parentName);
                if (parent) visit(parent);
            }
        }
        result.push(decl);
    }

    for (const decl of declarations) {
        visit(decl);
    }

    return result;
}
