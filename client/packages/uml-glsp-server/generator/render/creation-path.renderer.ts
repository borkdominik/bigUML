/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { type Declaration, Multiplicity } from '@borkdominik-biguml/uml-language-tooling';
import { Eta } from 'eta';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const eta = new Eta({ views: path.join(__dirname, '..', 'templates') });

// ============================================================================
// Main entry point
// ============================================================================

export function renderCreationPath(extensionPath: string, declarations: Declaration[]): { path: string; content: string }[] {
    const mapping = buildCreationPathMapping(declarations);
    const content = eta.render('./get-creation-path', { mapping });

    return [
        {
            path: path.join(extensionPath, 'vscode', 'get-creation-path.ts'),
            content
        }
    ];
}

// ============================================================================
// Helpers
// ============================================================================

function buildCreationPathMapping(declarations: Declaration[]): Record<string, Array<{ property: string; allowedChildTypes?: string[] }>> {
    const mapping: Record<string, Array<{ property: string; allowedChildTypes?: string[] }>> = {};

    declarations.forEach(parentDecl => {
        if (!parentDecl.properties) {
            return;
        }
        parentDecl.properties.forEach(prop => {
            const isArray = prop.multiplicity === Multiplicity.ZERO_TO_N || prop.multiplicity === Multiplicity.ONE_TO_N;
            const isComplex = prop.types[0]?.type === 'complex';
            if (isArray && isComplex) {
                if (!mapping[parentDecl.name!]) {
                    mapping[parentDecl.name!] = [];
                }
                const allowedType = prop.types[0].typeName;
                let allowedChildTypes = declarations
                    .filter(childDecl => childDecl.extends && childDecl.extends.includes(allowedType))
                    .map(childDecl => childDecl.name!);
                if (allowedChildTypes.length === 0) {
                    allowedChildTypes = [allowedType];
                }
                mapping[parentDecl.name!].push({
                    property: prop.name,
                    allowedChildTypes
                });
            }
        });
    });
    return mapping;
}
