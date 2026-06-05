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
    // Merge inherited properties
    for (const declaration of declarations) {
        if (declaration.extends && declaration.extends.length > 0) {
            for (const extend of declaration.extends) {
                const parent = declarations.find(d => d.name === extend);
                if (parent?.properties) {
                    declaration.properties = [...(declaration.properties ?? []), ...parent.properties];
                }
            }
        }
        declaration.extendedBy = [];
    }

    // Build extendedBy reverse mapping
    for (const declaration of declarations) {
        if (declaration.extends) {
            for (const extend of declaration.extends) {
                const parent = declarations.find(d => d.name === extend);
                if (parent) {
                    parent.extendedBy!.push(declaration.name!);
                }
            }
        }
    }

    // Strip properties from abstract classes
    for (const declaration of declarations) {
        if (declaration.isAbstract && declaration.type === 'class') {
            declaration.properties = [];
        }
    }

    return declarations;
}
