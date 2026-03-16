/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import type { PropertyPaletteNode } from './jsx-namespace.js';

/**
 * Normalizes JSX children into a flat array of property items.
 * Filters out null, undefined, booleans, strings, and numbers.
 */
export function normalizeChildren(children: PropertyPaletteNode): object[] {
    if (children == null || typeof children === 'boolean' || typeof children === 'string' || typeof children === 'number') {
        return [];
    }
    if (Array.isArray(children)) {
        return children.flatMap(normalizeChildren);
    }
    return [children];
}
