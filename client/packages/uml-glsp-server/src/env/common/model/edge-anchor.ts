/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

/**
 * Edges attached to other edges.
 *
 * Every edge offers a dot at its centre, a port of the edge in the graph. An edge drawn to it ends, in the
 * model, on the `EdgeAnchor` of the edge the dot is on - a node, since a relation can only end on one -
 * and is routed back to the dot when the graph is built. Both carry ids derived from the edge's, so each
 * can be found from the other without looking anything up.
 */

/** The type of the dot at the centre of an edge. */
export const EDGE_CENTER_TYPE = 'uml-port:edge-center';

const EDGE_CENTER_SUFFIX = '__edge-center';
const EDGE_ANCHOR_PREFIX = 'EdgeAnchor_';

/** The id of the dot at the centre of an edge. */
export function edgeCenterId(edgeId: string): string {
    return `${edgeId}${EDGE_CENTER_SUFFIX}`;
}

/** The edge a centre dot is on, or `undefined` where the id is not that of a centre dot. */
export function parseEdgeCenterId(id: string): string | undefined {
    return id.endsWith(EDGE_CENTER_SUFFIX) ? id.slice(0, -EDGE_CENTER_SUFFIX.length) : undefined;
}

/** The id of the `EdgeAnchor` on an edge - one per edge, shared by every edge attached to it. */
export function edgeAnchorId(edgeId: string): string {
    return `${EDGE_ANCHOR_PREFIX}${edgeId}`;
}
