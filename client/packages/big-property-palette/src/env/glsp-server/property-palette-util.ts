/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

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
    /** Not stored on the element - read off the shape's bounds, and set by swapping them. */
    ORIENTATION: [
        { label: 'horizontal', value: 'HORIZONTAL' },
        { label: 'vertical', value: 'VERTICAL' }
    ]
} as const;
