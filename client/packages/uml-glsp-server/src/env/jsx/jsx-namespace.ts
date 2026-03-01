/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import type { GModelElement } from '@eclipse-glsp/server';

/**
 * The type of children accepted by GLSP JSX components.
 * Mirrors React's ReactNode — allows conditional rendering patterns
 * like `{cond && <Elem/>}` which produce `false | GModelElement`.
 */
export type GlspNode = GModelElement | GlspNode[] | string | number | boolean | null | undefined;

/**
 * JSX namespace for TypeScript's automatic JSX transform.
 *
 * When `"jsx": "react-jsx"` and `"jsxImportSource": "@borkdominik-biguml/uml-glsp-server/jsx"` are set,
 * TypeScript looks for the `JSX` namespace exported from the `jsx-runtime` module.
 */
export namespace JSX {
    /**
     * The return type of JSX expressions — always a concrete GModelElement.
     */
    export type Element = GModelElement;

    /**
     * Props that can be passed to any GModelElement class used as a JSX intrinsic.
     * Since we don't use string-based intrinsic elements, this is empty.
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    export interface IntrinsicElements {}

    /**
     * Base props interface for class-based elements (GModelElement constructors).
     * TypeScript uses this to type-check props when a class constructor is used as a JSX tag.
     */
    export interface ElementChildrenAttribute {
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        children: {};
    }

    /**
     * Common properties available on all GModelElement-based JSX tags.
     */
    export interface IntrinsicAttributes {
        key?: string;
    }
}
