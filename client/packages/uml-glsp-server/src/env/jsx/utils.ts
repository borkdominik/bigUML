/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { GModelElement } from '@eclipse-glsp/server';
import type { GlspNode } from './jsx-namespace.js';

/**
 * Normalizes JSX children into a flat array of GModelElements.
 * Filters out null, undefined, booleans, strings, and numbers.
 */
export function normalizeChildren(children: GlspNode): GModelElement[] {
    if (children == null || typeof children === 'boolean' || typeof children === 'string' || typeof children === 'number') {
        return [];
    }
    if (Array.isArray(children)) {
        return children.flatMap(normalizeChildren);
    }
    if (children instanceof GModelElement) {
        return [children];
    }
    return [];
}

/**
 * Wires parent references for all children of an element.
 */
export function wireParent(element: GModelElement): void {
    for (const child of element.children) {
        child.parent = element;
    }
}
