/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

/** A value inside a JSON tree and where it sits, as a JSONPath expression - `$.diagram.entities[2]`. */
export interface JsonPathNode {
    value: unknown;
    path: string;
}

/**
 * Every object in the tree that carries the given property - and, where a value is given, carries it
 * with that value.
 */
export function findNodes(json: unknown, property: string, value?: unknown): JsonPathNode[] {
    const nodes: JsonPathNode[] = [];
    collect(json, '$', nodes);
    return nodes.filter(node => {
        if (typeof node.value !== 'object' || node.value === null || !(property in node.value)) {
            return false;
        }
        return value === undefined ? true : (node.value as Record<string, unknown>)[property] === value;
    });
}

/** Every value in the tree, depth first, each with its path. */
export function collect(json: unknown, currentPath: string, nodes: JsonPathNode[]): void {
    if (typeof json === 'object' && json !== null) {
        if (Array.isArray(json)) {
            json.forEach((element, index) => collect(element, `${currentPath}[${index}]`, nodes));
        } else {
            for (const [key, child] of Object.entries(json)) {
                collect(child, `${currentPath}.${key}`, nodes);
            }
        }
    }
    nodes.push({ path: currentPath, value: json });
}
