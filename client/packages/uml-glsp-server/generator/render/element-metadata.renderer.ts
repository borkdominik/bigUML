/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { type Declaration, Decorator, getConcreteElements, isValueProperty, Multiplicity } from '@borkdominik-biguml/uml-language-tooling';
import { Eta } from 'eta';
import path from 'path';
import { fileURLToPath } from 'url';
import { type Containment, resolveContainment } from './containment.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const eta = new Eta({ views: path.join(__dirname, '..', 'templates') });

// ============================================================================
// Types
// ============================================================================

/** What kind of thing an element is on the canvas, read off the base class it extends. */
type ElementKind = 'node' | 'edge' | 'unbounded';

interface Size {
    width: number;
    height: number;
}

interface ElementMetadataEntry {
    astType: string;
    kind: ElementKind;
    noBounds: boolean;
    owned: boolean;
    floating: boolean;
    defaultSize?: Size;
    opensWith?: { property: string; count: number };
    shape: { repositionable: boolean; resizable: boolean; deletable: boolean };
    contains: Containment[];
    optionalName: boolean;
    unnamed: boolean;
    defaults: DefaultValue[];
}

interface DefaultValue {
    property: string;
    defaultValue: unknown;
}

/**
 * What a property of one of these types opens at when the definition gives it no value of its own, in
 * an element that asks for defaults (`@Glsp.defaults`). A text, and any other value with nothing to go
 * by, is left out rather than guessed.
 */
const TYPE_DEFAULTS: Record<string, unknown> = {
    boolean: false,
    number: 0,
    Visibility: 'NONE',
    Concurrency: 'SEQUENTIAL'
};

// ============================================================================
// Main entry point
// ============================================================================

export function renderElementMetadata(extensionPath: string, declarations: Declaration[]): { path: string; content: string }[] {
    const entries: Record<string, ElementMetadataEntry> = {};
    // The elements created from a template id rather than from their own AST type - an alias, whose id
    // is `<representation>__<template>__<AstType>` with the element's name in lower case as the template.
    const templates: Record<string, string> = {};
    for (const decl of getConcreteElements(declarations)) {
        entries[decl.name!] = buildEntry(decl, declarations);
        if (Decorator.has(decl.decorators, 'alias')) {
            templates[decl.name!.toLowerCase()] = decl.name!;
        }
    }

    const content = eta.render('./element-metadata', { entries, templates });

    return [
        {
            path: path.join(extensionPath, 'vscode', 'element-metadata.ts'),
            content
        }
    ];
}

// ============================================================================
// Helpers
// ============================================================================

function buildEntry(decl: Declaration, declarations: Declaration[]): ElementMetadataEntry {
    const aliasDec = Decorator.find(decl.decorators, 'alias');
    const astType = (aliasDec && Decorator.getArg<string>(aliasDec)) || decl.name!;

    const noBounds = Decorator.has(decl.decorators, 'noBounds');
    const owned = noBounds || Decorator.has(decl.decorators, 'owned');

    const sizeDec = Decorator.find(decl.decorators, 'defaultSize');
    const opensWithDec = Decorator.find(decl.decorators, 'opensWith');
    const shapeDec = Decorator.find(decl.decorators, 'shape');
    const shapeOptions = shapeDec ? (Decorator.getArg<Record<string, unknown>>(shapeDec) ?? {}) : {};

    return {
        astType,
        kind: kindOf(decl, declarations),
        noBounds,
        owned,
        floating: Decorator.has(decl.decorators, 'floating'),
        defaultSize: sizeDec ? (Decorator.getArg<Record<string, unknown>>(sizeDec) as Size | undefined) : undefined,
        opensWith: opensWithDec
            ? (Decorator.getArg<Record<string, unknown>>(opensWithDec) as { property: string; count: number } | undefined)
            : undefined,
        shape: {
            repositionable: (shapeOptions.repositionable as boolean | undefined) ?? !owned,
            resizable: (shapeOptions.resizable as boolean | undefined) ?? !owned,
            deletable: (shapeOptions.deletable as boolean | undefined) ?? true
        },
        contains: resolveContainment(decl, declarations),
        // Whether the grammar can write the element without a name at all: a name declared `name?` is an
        // optional assignment, which is the only case where clearing one can be stored.
        optionalName: (decl.properties ?? []).some(prop => prop.name === 'name' && prop.isOptional),
        // Whether the element has no name to write at all - a note, which is the text it holds.
        unnamed: !(decl.properties ?? []).some(prop => prop.name === 'name'),
        defaults: defaultsOf(decl, declarations)
    };
}

/**
 * The values a new element of this type is created with: the ones its definition gives, and - where the
 * element asks for defaults (`@Glsp.defaults`) - an empty list for a list, and the type's own default
 * for the types that have one (`TYPE_DEFAULTS`).
 */
function defaultsOf(decl: Declaration, declarations: Declaration[]): DefaultValue[] {
    const withDefaultAll = Decorator.has(decl.decorators, 'defaults');
    const seen = new Set<string>();
    const defaults: DefaultValue[] = [];

    for (const prop of decl.properties ?? []) {
        if (seen.has(prop.name)) {
            continue;
        }
        seen.add(prop.name);

        // A reference has nothing to point to until one is chosen, and layout is written by the create
        // handler, where the element is placed.
        if (Decorator.has(prop.decorators, 'reference') || isValueProperty(prop, declarations)) {
            continue;
        }
        if (prop.defaultValue !== undefined) {
            defaults.push({ property: prop.name, defaultValue: prop.defaultValue === '[]' ? [] : prop.defaultValue });
            continue;
        }
        if (!withDefaultAll && prop.isOptional) {
            continue;
        }

        const isList = prop.multiplicity === Multiplicity.ZERO_TO_N || prop.multiplicity === Multiplicity.ONE_TO_N;
        const typeName = prop.types[0]?.typeName;
        if (isList) {
            defaults.push({ property: prop.name, defaultValue: [] });
        } else if (typeName !== undefined && typeName in TYPE_DEFAULTS) {
            defaults.push({ property: prop.name, defaultValue: TYPE_DEFAULTS[typeName] });
        }
    }
    return defaults;
}

function kindOf(decl: Declaration, declarations: Declaration[]): ElementKind {
    const seen = new Set<string>();
    const queue = [...(decl.extends ?? [])];
    while (queue.length > 0) {
        const base = queue.shift()!;
        if (seen.has(base)) {
            continue;
        }
        seen.add(base);
        if (base === 'Node' || base === 'ElementWithSizeAndPosition') {
            return 'node';
        }
        if (base === 'Edge') {
            return 'edge';
        }
        if (base === 'Unbounded') {
            return 'unbounded';
        }
        const baseDecl = declarations.find(d => d.name === base);
        queue.push(...(baseDecl?.extends ?? []));
    }
    throw new Error(`[element-metadata] '${decl.name}' extends none of Node, Edge or Unbounded`);
}
