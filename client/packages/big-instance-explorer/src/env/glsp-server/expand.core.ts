/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

/**
 * Pure transitive-expansion of a classifier selection for "association depth" (topic 4d).
 *
 * Generating a connected graph means following associations beyond the selected classifiers:
 * e.g. generating a `Company` at depth 3 should also generate the `Employee`s that work for it
 * (1 hop) and their `Address`es (2 hops). This module computes *which* classifiers to instantiate;
 * the actual instance/link creation is done by the generation core and the link planner.
 */

/** A classifier-level association edge. Reachability is direction-agnostic (a target reaches its sources). */
export interface ClassifierEdge {
    sourceClassifierId: string;
    targetClassifierId: string;
}

/**
 * Expands `selectedIds` to the classifiers reachable by following associations transitively.
 *
 * Depth semantics:
 * - `depth <= 1`: no expansion — returns the selected classifiers only (depth 1 still links them
 *   directly; depth 0 creates no links, handled by the link planner).
 * - `depth N >= 2`: also include classifiers within `N - 1` association hops (treating associations
 *   as undirected for reachability), so the generated set forms a connected neighbourhood.
 *
 * Returns the selected ids first, then newly reached ids in breadth-first order; deduplicated.
 */
export function expandClassifierSelection(selectedIds: readonly string[], edges: readonly ClassifierEdge[], depth: number): string[] {
    const result: string[] = [];
    const seen = new Set<string>();
    for (const id of selectedIds) {
        if (!seen.has(id)) {
            seen.add(id);
            result.push(id);
        }
    }

    const maxHops = depth - 1;
    if (maxHops <= 0 || result.length === 0) {
        return result;
    }

    // Undirected adjacency: a Company is reachable from an Employee and vice versa.
    const adjacency = new Map<string, Set<string>>();
    const connect = (from: string, to: string): void => {
        let neighbours = adjacency.get(from);
        if (!neighbours) {
            neighbours = new Set<string>();
            adjacency.set(from, neighbours);
        }
        neighbours.add(to);
    };
    for (const edge of edges) {
        if (edge.sourceClassifierId === edge.targetClassifierId) {
            continue; // a reflexive association adds no new classifier
        }
        connect(edge.sourceClassifierId, edge.targetClassifierId);
        connect(edge.targetClassifierId, edge.sourceClassifierId);
    }

    let frontier = [...result];
    for (let hop = 0; hop < maxHops; hop++) {
        const next: string[] = [];
        for (const node of frontier) {
            for (const neighbour of adjacency.get(node) ?? []) {
                if (!seen.has(neighbour)) {
                    seen.add(neighbour);
                    result.push(neighbour);
                    next.push(neighbour);
                }
            }
        }
        if (next.length === 0) {
            break;
        }
        frontier = next;
    }
    return result;
}
