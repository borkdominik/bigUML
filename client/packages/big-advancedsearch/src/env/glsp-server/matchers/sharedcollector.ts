/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import type { GenericAstNode } from '@borkdominik-biguml/uml-model-server';

/**
 * Array-valued property keys that may contain nested AST children
 * in serialized Langium diagram nodes.
 */
const NESTED_KEYS = ['entities', 'relations', 'properties', 'operations', 'parameters', 'values', 'slots'];

export class SharedElementCollector {
    /**
     * Walk a serialized Langium AST tree depth-first.
     * For every object that has a `__type`, the callback is invoked
     * with the element and the name of its closest named ancestor.
     * The traversal automatically recurses into all known array properties.
     */
    static collectRecursively(element: GenericAstNode, callback: (el: any, parentName?: string) => void, parentName?: string): void {
        if (!element || typeof element !== 'object') return;

        if (element.$type) {
            callback(element, parentName);
        }

        let name = parentName;
        if ('name' in element) {
            name = element.name as string;
        }

        for (const key of NESTED_KEYS) {
            const nested = element[key];
            if (Array.isArray(nested)) {
                for (const child of nested) {
                    SharedElementCollector.collectRecursively(child, callback, name);
                }
            }
        }
    }
}
