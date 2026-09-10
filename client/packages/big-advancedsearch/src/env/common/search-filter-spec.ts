/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

export type SearchFilterOperator = 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan';
export type SearchFilterValueType = 'string' | 'boolean' | 'number';

export interface SearchFilterSpec {
    key: string;
    scopes: string[];
    valueType: SearchFilterValueType;
    defaultOperator?: SearchFilterOperator;
    aliases?: string[];
    editable?: boolean;
    values?: readonly string[];
    astField?: string;
}

const VISIBILITY_VALUES = ['PUBLIC', 'PRIVATE', 'PROTECTED', 'PACKAGE'] as const;
const AGGREGATION_VALUES = ['NONE', 'SHARED', 'COMPOSITE'] as const;
const CONCURRENCY_VALUES = ['SEQUENTIAL', 'GUARDED', 'CONCURRENT'] as const;
const PARAMETER_DIRECTION_VALUES = ['IN', 'OUT', 'INOUT', 'RETURN'] as const;
const EFFECT_TYPE_VALUES = ['CREATE', 'READ', 'UPDATE', 'DELETE'] as const;

export const FILTER_SPECS: SearchFilterSpec[] = [
    {
        key: 'name',
        scopes: [
            'Class',
            'Attribute',
            'Method',
            'Relationship',
            'DataType',
            'Enumeration',
            'EnumerationLiteral',
            'Interface',
            'PrimitiveType',
            'Package',
            'InstanceSpecification',
            'Slot',
            'Parameter'
        ],
        valueType: 'string',
        defaultOperator: 'equals',
        editable: true
    },
    {
        key: 'visibility',
        scopes: [
            'Class',
            'Attribute',
            'Method',
            'DataType',
            'EnumerationLiteral',
            'Package',
            'InstanceSpecification',
            'Relationship',
            'Parameter'
        ],
        valueType: 'string',
        defaultOperator: 'equals',
        editable: true,
        values: VISIBILITY_VALUES
    },
    {
        key: 'isAbstract',
        scopes: ['Class', 'Method', 'DataType'],
        valueType: 'boolean',
        defaultOperator: 'equals',
        editable: true
    },
    {
        key: 'isActive',
        scopes: ['Class'],
        valueType: 'boolean',
        defaultOperator: 'equals',
        editable: true
    },
    {
        key: 'isStatic',
        scopes: ['Attribute', 'Method'],
        valueType: 'boolean',
        defaultOperator: 'equals',
        editable: true
    },
    {
        key: 'isDerived',
        scopes: ['Attribute'],
        valueType: 'boolean',
        defaultOperator: 'equals',
        editable: true
    },
    {
        key: 'isDerivedUnion',
        scopes: ['Attribute'],
        valueType: 'boolean',
        defaultOperator: 'equals',
        editable: true
    },
    {
        key: 'isReadOnly',
        scopes: ['Attribute'],
        valueType: 'boolean',
        defaultOperator: 'equals',
        editable: true
    },
    {
        key: 'isOrdered',
        scopes: ['Attribute', 'Parameter'],
        valueType: 'boolean',
        defaultOperator: 'equals',
        editable: true
    },
    {
        key: 'isException',
        scopes: ['Parameter'],
        valueType: 'boolean',
        defaultOperator: 'equals',
        editable: true
    },
    {
        key: 'isStream',
        scopes: ['Parameter'],
        valueType: 'boolean',
        defaultOperator: 'equals',
        editable: true
    },
    {
        key: 'parameterDirection',
        scopes: ['Parameter'],
        valueType: 'string',
        defaultOperator: 'equals',
        editable: true,
        values: PARAMETER_DIRECTION_VALUES,
        astField: 'direction'
    },
    {
        key: 'definingFeature',
        scopes: ['Slot'],
        valueType: 'string',
        defaultOperator: 'equals'
    },
    {
        key: 'parameterType',
        scopes: ['Parameter'],
        valueType: 'string',
        defaultOperator: 'equals'
    },
    {
        key: 'effectType',
        scopes: ['Parameter'],
        valueType: 'string',
        defaultOperator: 'equals',
        editable: true,
        values: EFFECT_TYPE_VALUES,
        astField: 'effect'
    },
    {
        key: 'isUnique',
        scopes: ['Attribute', 'Parameter'],
        valueType: 'boolean',
        defaultOperator: 'equals',
        editable: true
    },
    {
        key: 'aggregation',
        scopes: ['Attribute', 'Relationship'],
        valueType: 'string',
        defaultOperator: 'equals',
        editable: true,
        values: AGGREGATION_VALUES
    },
    {
        key: 'propertyType',
        scopes: ['Attribute'],
        valueType: 'string',
        defaultOperator: 'equals'
    },
    {
        key: 'isQuery',
        scopes: ['Method'],
        valueType: 'boolean',
        defaultOperator: 'equals',
        editable: true
    },
    {
        key: 'concurrency',
        scopes: ['Method'],
        valueType: 'string',
        defaultOperator: 'equals',
        editable: true,
        values: CONCURRENCY_VALUES
    },
    {
        key: 'value',
        scopes: ['EnumerationLiteral'],
        valueType: 'string',
        defaultOperator: 'equals',
        editable: true
    },
    {
        key: 'uri',
        scopes: ['Package'],
        valueType: 'string',
        defaultOperator: 'equals',
        editable: true
    },
    {
        key: 'multiplicity',
        scopes: ['Attribute', 'Parameter'],
        valueType: 'string',
        defaultOperator: 'equals'
    },
    {
        key: 'source',
        scopes: ['Relationship'],
        valueType: 'string',
        defaultOperator: 'equals'
    },
    {
        key: 'target',
        scopes: ['Relationship'],
        valueType: 'string',
        defaultOperator: 'equals'
    },
    {
        key: 'relationType',
        scopes: ['Relationship'],
        valueType: 'string',
        defaultOperator: 'equals'
    },
    {
        key: 'sourceAggregation',
        scopes: ['Relationship'],
        valueType: 'string',
        defaultOperator: 'equals',
        editable: true,
        values: AGGREGATION_VALUES
    },
    {
        key: 'targetAggregation',
        scopes: ['Relationship'],
        valueType: 'string',
        defaultOperator: 'equals',
        editable: true,
        values: AGGREGATION_VALUES
    },
    {
        key: 'sourceMultiplicity',
        scopes: ['Relationship'],
        valueType: 'string',
        defaultOperator: 'equals'
    },
    {
        key: 'targetMultiplicity',
        scopes: ['Relationship'],
        valueType: 'string',
        defaultOperator: 'equals'
    }
];

export const SPEC_BY_KEY: ReadonlyMap<string, SearchFilterSpec> = new Map(FILTER_SPECS.map(spec => [spec.key, spec]));

export const EDITABLE_SPECS: readonly SearchFilterSpec[] = FILTER_SPECS.filter(spec => spec.editable);

export function astFieldOf(key: string): string {
    return SPEC_BY_KEY.get(key)?.astField ?? key;
}

export function isTokenProperty(key: string): boolean {
    const spec = SPEC_BY_KEY.get(key);
    return !!spec && (spec.valueType === 'boolean' || (spec.values?.length ?? 0) > 0);
}
