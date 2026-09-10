/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import type { ClassDiagramEdges, ClassDiagramNodes } from '@borkdominik-biguml/uml-model-server/grammar';
import type { SearchCriteria, SearchFilter } from './search-ast.js';

export function matchesCriteriaOnElement(
    element: any,
    criteria: SearchCriteria,
    index: Map<string, ClassDiagramNodes | ClassDiagramEdges>
): boolean {
    if (!element) {
        return false;
    }

    if (!matchesElementType(element, criteria.type)) {
        return false;
    }

    if (!criteria.filters.every(filter => matchesFilter(element, filter, index))) {
        return false;
    }

    return criteria.children.every(childCriteria => {
        const children = getChildrenForCriteria(element, childCriteria);
        return children.some(child => matchesCriteriaOnElement(child, childCriteria, index));
    });
}

function matchesElementType(element: any, expectedType: string): boolean {
    const actual = String(element.$type ?? '').toLowerCase();
    const expected = expectedType.toLowerCase();

    if (expected === 'class') {
        return actual === 'class' || actual === 'abstractclass';
    }

    if (expected === 'relationship' || expected === 'relation') {
        return isRelationshipType(actual);
    }

    if (expected === 'attribute') {
        return actual === 'property';
    }

    if (expected === 'method') {
        return actual === 'operation';
    }

    return actual === expected;
}

function getChildrenForCriteria(element: any, childCriteria: SearchCriteria): any[] {
    switch (childCriteria.type) {
        case 'Attribute':
            return Array.isArray(element.properties) ? element.properties : [];

        case 'Method':
            return Array.isArray(element.operations) ? element.operations : [];

        case 'EnumerationLiteral':
            return Array.isArray(element.values) ? element.values : [];

        case 'Slot':
            return Array.isArray(element.slots) ? element.slots : [];
        
        case 'Parameter':
            return Array.isArray(element.parameters)
                ? element.parameters
                : Array.isArray(element.ownedParameters)
                    ? element.ownedParameters
                    : [];

        default:
            return [];
    }
}

function matchesFilter(element: any, filter: SearchFilter, index: Map<string, ClassDiagramNodes | ClassDiagramEdges>): boolean {
    if (filter.value.type === 'criteria') {
        const nestedCriteria = filter.value.value as SearchCriteria;

        if (filter.key !== 'source' && filter.key !== 'target') {
            return false;
        }

        const refId = element[filter.key]?.__value ?? element[filter.key]?.$refText;

        const refNode = index.get(refId);

        if (!refNode) {
            return false;
        }

        return matchesCriteriaOnElement(refNode, nestedCriteria, index);
    }

    const actual = getFilterValue(element, filter);
    const expected = filter.value.value;

    switch (filter.operator) {
        case 'equals':
            return normalize(actual) === normalize(expected);

        case 'contains':
            return actual !== undefined && actual !== null && String(actual).toLowerCase().includes(String(expected).toLowerCase());

        case 'startsWith':
            return actual !== undefined && actual !== null && String(actual).toLowerCase().startsWith(String(expected).toLowerCase());

        case 'endsWith':
            return actual !== undefined && actual !== null && String(actual).toLowerCase().endsWith(String(expected).toLowerCase());

        case 'greaterThan':
            return Number(actual) > Number(expected);

        case 'lessThan':
            return Number(actual) < Number(expected);

        default:
            return false;
    }
}

const filterValueExtractors: Record<string, (element: any) => unknown> = {
    type: element => element.propertyType?.$refText,
    propertyType: element => element.propertyType?.ref?.name ?? element.propertyType?.$refText,
    effectType: element => element.effect,
    parameterDirection: element => element.direction,
    parameterType: element => element.parameterType?.ref?.name ?? element.parameterType?.$refText,
    definingFeature: element => element.definingFeature?.ref?.name ?? element.definingFeature?.$refText
};

function getFilterValue(element: any, filter: SearchFilter): unknown {
    const extractor = filterValueExtractors[filter.key];
    return extractor ? extractor(element) : element[filter.key];
}

function normalize(value: unknown): string {
    return String(value).toLowerCase();
}

function isRelationshipType(type: string): boolean {
    return [
        'association',
        'aggregation',
        'composition',
        'generalization',
        'dependency',
        'abstraction',
        'usage',
        'realization',
        'interfacerealization',
        'substitution',
        'packageimport',
        'packagemerge'
    ].includes(type);
}
