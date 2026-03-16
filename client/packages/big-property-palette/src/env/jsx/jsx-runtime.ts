/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { normalizeChildren } from './utils.js';

// ============================================================================
// Types
// ============================================================================

/**
 * A function component that takes props and returns a property palette result.
 */
export type FunctionComponent<P = Record<string, unknown>> = (props: P) => any;

// ============================================================================
// Fragment
// ============================================================================

/**
 * Fragment symbol — used as JSX tag to group multiple elements without a wrapper.
 */
export const Fragment = Symbol.for('PropertyPaletteJsx.Fragment');

// ============================================================================
// Core JSX factory
// ============================================================================

/**
 * The core JSX factory function. Called by the TypeScript JSX transform (automatic mode).
 *
 * Only function components and Fragment are supported.
 *
 * @param type - A function component or Fragment
 * @param props - The JSX props including children
 * @returns A PropertyPaletteResult or ElementProperty instance
 */
export function jsx(type: any, props: any): any {
    const { children: rawChildren, ...restProps } = props ?? {};
    const children = normalizeChildren(rawChildren);

    // === Fragment ===
    if (type === Fragment) {
        return children;
    }

    // === Function component ===
    const functionProps = { ...restProps };
    if (children.length > 0) {
        functionProps.children = children.length === 1 ? children[0] : children;
    }
    return type(functionProps);
}

/**
 * jsxs is the same as jsx — React uses it for elements with multiple static children,
 * but our runtime doesn't need to distinguish.
 */
export const jsxs = jsx;

// ============================================================================
// JSX namespace — required for automatic JSX transform type checking
// ============================================================================
export type { JSX } from './jsx-namespace.js';
