/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

export type SearchElementType =
    | 'Class'
    | 'Attribute'
    | 'Method'
    | 'Relationship'
    | 'DataType'
    | 'Enumeration'
    | 'EnumerationLiteral'
    | 'Interface'
    | 'PrimitiveType'
    | 'Package'
    | 'InstanceSpecification'
    | 'Slot'
    | 'Parameter';

export type SearchOperator = 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan';

export type SearchValue =
    | { type: 'string'; value: string }
    | { type: 'boolean'; value: boolean }
    | { type: 'number'; value: number }
    | { type: 'criteria'; value: SearchCriteria };

export interface SearchFilter {
    key: string;
    operator: SearchOperator;
    value: SearchValue;
}

export interface SearchCriteria {
    type: SearchElementType;
    filters: SearchFilter[];
    children: SearchCriteria[];
}
