/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { type Declaration, Decorator, type Property } from '@borkdominik-biguml/uml-language-tooling';
import { Eta } from 'eta';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const eta = new Eta({ views: path.join(__dirname, '..', 'templates') });

// ============================================================================
// Types
// ============================================================================

interface DefaultMappingEntry {
    property: string;
    propertyType: string;
    defaultValue?: Property['defaultValue'];
}

type DefaultMapping = Record<string, DefaultMappingEntry[]>;

// ============================================================================
// Main entry point
// ============================================================================

export function renderDefaultValue(extensionPath: string, declarations: Declaration[]): { path: string; content: string }[] {
    const payload = buildDefaultValueMapping(declarations);
    const content = eta.render('./get-default-value', payload);

    return [
        {
            path: path.join(extensionPath, 'vscode', 'get-default-value.ts'),
            content
        }
    ];
}

// ============================================================================
// Helpers
// ============================================================================

function buildDefaultValueMapping(declarations: Declaration[]): {
    defaultMapping: DefaultMapping;
    noBoundsClasses: string[];
    astTypeMap: Record<string, string>;
} {
    const mapping: DefaultMapping = {};
    const noBoundsClasses: string[] = [];
    const astTypeMap: Record<string, string> = {};

    for (const decl of declarations) {
        if (Decorator.has(decl.decorators, 'noBounds')) {
            noBoundsClasses.push(decl.name!);
        }

        const aliasDec = Decorator.find(decl.decorators, 'alias');
        if (aliasDec) {
            const value = Decorator.getArg<string>(aliasDec);
            if (value) {
                astTypeMap[decl.name!.toLowerCase()] = value;
            }
        }

        if (decl.type !== 'class' || !decl.name || !decl.properties) {
            continue;
        }

        const withDefaultAll = Decorator.has(decl.decorators, 'defaults');
        const seen = new Set<string>();
        const entries: DefaultMappingEntry[] = [];

        for (const prop of decl.properties) {
            if (seen.has(prop.name)) {
                continue;
            }
            seen.add(prop.name);

            if (!withDefaultAll && prop.isOptional && prop.defaultValue === undefined) {
                continue;
            }

            const firstType = prop.types[0];
            if (!firstType) {
                continue;
            }

            const entry: DefaultMappingEntry = {
                property: prop.name,
                propertyType: firstType.typeName
            };
            if (prop.defaultValue !== undefined) {
                entry.defaultValue = prop.defaultValue;
            }

            entries.push(entry);
        }

        mapping[decl.name] = entries;
    }

    return {
        defaultMapping: mapping,
        noBoundsClasses,
        astTypeMap
    };
}
