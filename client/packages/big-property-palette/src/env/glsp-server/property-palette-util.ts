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
        { label: 'package', value: 'PACKAGE' }
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
    ]
} as const;
