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
    optionalNameClasses: string[];
    unnamedClasses: string[];
    astTypeMap: Record<string, string>;
} {
    const mapping: DefaultMapping = {};
    const noBoundsClasses: string[] = [];
    const optionalNameClasses: string[] = [];
    const unnamedClasses: string[] = [];
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

        // Whether the grammar can write this element without a name at all. A name declared `name?`
        // becomes an optional assignment, which is the only case where clearing one can be stored -
        // there is no way to write an empty name, since `LangiumText` needs at least one token.
        if (decl.properties.some(prop => prop.name === 'name' && prop.isOptional)) {
            optionalNameClasses.push(decl.name);
        }

        // Whether the element has no name to write at all - a note, which is the text it holds and has
        // nothing else to be called. Taken from the declared properties rather than from the mapping
        // below, which drops an optional property that carries no default and so cannot tell a class
        // with no name from one whose name is simply not defaulted.
        if (!decl.properties.some(prop => prop.name === 'name')) {
            unnamedClasses.push(decl.name);
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
        optionalNameClasses,
        unnamedClasses,
        astTypeMap
    };
}
