/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import type { ElementProperties, ElementProperty } from '../common/property-palette.model.js';

/**
 * The result of building a property palette via JSX.
 * Structurally matches what `SetPropertyPaletteAction.create()` expects.
 */
export interface PropertyPaletteResult {
    elementId: string;
    palette?: ElementProperties;
}

/**
 * The type of children accepted by property palette JSX components.
 * Mirrors React's ReactNode — allows conditional rendering patterns
 * like `{cond && <Elem/>}` which produce `false | ElementProperty`.
 */
export type PropertyPaletteNode =
    | PropertyPaletteResult
    | ElementProperty
    | PropertyPaletteNode[]
    | string
    | number
    | boolean
    | null
    | undefined;

/**
 * JSX namespace for TypeScript's automatic JSX transform.
 *
 * When `"jsx": "react-jsx"` and `"jsxImportSource": "@borkdominik-biguml/big-property-palette/jsx"` are set,
 * TypeScript looks for the `JSX` namespace exported from the `jsx-runtime` module.
 */
export namespace JSX {
    /**
     * The return type of JSX expressions — a property palette result.
     */
    export type Element = PropertyPaletteResult;

    /**
     * Since we don't use string-based intrinsic elements, this is empty.
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    export interface IntrinsicElements {}

    /**
     * Tells TypeScript which prop holds children.
     */
    export interface ElementChildrenAttribute {
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        children: {};
    }

    /**
     * Common properties available on all JSX tags.
     */
    export interface IntrinsicAttributes {
        key?: string;
    }
}
