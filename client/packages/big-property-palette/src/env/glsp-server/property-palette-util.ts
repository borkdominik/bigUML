/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { type AstNode, AstUtils } from 'langium';

/** One element of the model offered as the value of a reference. */
export interface ReferenceChoice {
    label: string;
    /** The element's id with the suffix the update handler reads a reference off. */
    value: string;
    secondaryText: string;
}

/** What the palette appends to an element id to send it as a reference rather than as text. */
const REFERENCE_VALUE_SUFFIX = '_refValue';

/**
 * Every named element of the model that one of the guards accepts, as a choice for a reference.
 * Generated handlers call this with the guards of the types the reference is declared to admit.
 */
export function referenceChoices(root: AstNode, guards: readonly ((item: unknown) => boolean)[]): ReferenceChoice[] {
    return AstUtils.streamAllContents(root)
        .filter(node => guards.some(guard => guard(node)))
        .map(node => node as AstNode & { __id?: string; name?: string })
        .filter(node => !!node.__id && !!node.name)
        .map(node => ({ label: node.name!, value: node.__id + REFERENCE_VALUE_SUFFIX, secondaryText: node.$type }))
        .toArray();
}

/**
 * Predefined choice constants used by generated property palette handlers.
 */
export const PropertyPaletteChoices = {
    VISIBILITY: [
        { label: 'public', value: 'PUBLIC' },
        { label: 'private', value: 'PRIVATE' },
        { label: 'protected', value: 'PROTECTED' },
        { label: 'package', value: 'PACKAGE' },
        { label: 'none', value: 'NONE' }
    ],
    AGGREGATION: [
        { label: 'none', value: 'NONE' },
        { label: 'shared', value: 'SHARED' },
        { label: 'composite', value: 'COMPOSITE' }
    ],
    CONCURRENCY: [
        { label: 'sequential', value: 'SEQUENTIAL' },
        { label: 'guarded', value: 'GUARDED' },
        { label: 'concurrent', value: 'CONCURRENT' }
    ],
    PARAMETER_DIRECTION: [
        { label: 'in', value: 'IN' },
        { label: 'out', value: 'OUT' },
        { label: 'inout', value: 'INOUT' },
        { label: 'return', value: 'RETURN' }
    ],
    EFFECT: [
        { label: 'create', value: 'CREATE' },
        { label: 'read', value: 'READ' },
        { label: 'update', value: 'UPDATE' },
        { label: 'delete', value: 'DELETE' }
    ],
    TRANSITION_KIND: [
        { label: 'internal', value: 'INTERNAL' },
        { label: 'external', value: 'EXTERNAL' },
        { label: 'local', value: 'LOCAL' }
    ],
    /** Which named point of a shape an end of the transition is pinned to; unset means it is not pinned. */
    CONNECTION_POINT: [
        { label: 'automatic', value: '' },
        { label: 'top', value: 'NORTH' },
        { label: 'right', value: 'EAST' },
        { label: 'bottom', value: 'SOUTH' },
        { label: 'left', value: 'WEST' }
    ],
    /** What a generic edge draws at one of its ends. */
    EDGE_MARKER: [
        { label: 'none', value: 'NONE' },
        { label: 'open arrow', value: 'OPEN_ARROW' },
        { label: 'triangle', value: 'TRIANGLE' },
        { label: 'filled triangle', value: 'FILLED_TRIANGLE' },
        { label: 'diamond', value: 'DIAMOND' },
        { label: 'filled diamond', value: 'FILLED_DIAMOND' },
        { label: 'cross', value: 'CROSS' }
    ],
    EDGE_LINE_STYLE: [
        { label: 'solid', value: 'SOLID' },
        { label: 'dashed', value: 'DASHED' },
        { label: 'dotted', value: 'DOTTED' }
    ],
    /** Not stored on the element - read off the shape's bounds, and set by swapping them. */
    ORIENTATION: [
        { label: 'horizontal', value: 'HORIZONTAL' },
        { label: 'vertical', value: 'VERTICAL' }
    ]
} as const;
