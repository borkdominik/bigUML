/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { parseEdgeCenterId } from '@borkdominik-biguml/uml-glsp-server';
import { type EdgeRouterRegistry, type EdgeRouting, GEdge, type GModelRoot, type Point } from '@eclipse-glsp/client';
import { GConnectionPointPort } from './connection-point.view.js';

/**
 * The dot at the centre of an edge, which another edge is drawn to when it is attached to this one.
 *
 * The server cannot place it: where an edge runs is worked out here, by routing. It is placed by
 * {@link placeEdgeCenterPorts} instead, once the edges are routed and before they are drawn. It stands
 * on the graph beside its edge rather than inside it, and names the edge in its id (see `edge-anchor.ts`).
 */
export class GEdgeCenterPort extends GConnectionPointPort {}

/** How many rounds of attached-to-attached edges are followed before giving up; guards against cycles. */
const MAX_ATTACHMENT_DEPTH = 5;

/**
 * Moves every edge's centre dot to the middle of the route just computed for its edge, then routes again
 * the edges drawn to those dots - repeated while that moves anything, for an edge attached to an edge
 * that is itself attached to one.
 */
export function placeEdgeCenterPorts(root: Readonly<GModelRoot>, edgeRouting: EdgeRouting, routers: EdgeRouterRegistry): void {
    // A child of the graph, as the edges are, so the routes are in the dots' own coordinates.
    const ports = Array.from(root.index.all()).filter((element): element is GEdgeCenterPort => element instanceof GEdgeCenterPort);
    if (ports.length === 0) {
        return;
    }

    for (let round = 0; round < MAX_ATTACHMENT_DEPTH; round++) {
        const moved = new Set<string>();
        for (const port of ports) {
            const edgeId = parseEdgeCenterId(port.id);
            const route = edgeId ? edgeRouting.get(edgeId) : undefined;
            const middle = route ? polylineMiddle(route) : undefined;
            if (!middle) {
                continue;
            }
            const position = { x: middle.x - port.size.width / 2, y: middle.y - port.size.height / 2 };
            if (position.x !== port.position.x || position.y !== port.position.y) {
                port.position = position;
                moved.add(port.id);
            }
        }
        if (moved.size === 0) {
            return;
        }

        for (const edge of Array.from(root.index.all())) {
            if (edge instanceof GEdge && (moved.has(edge.sourceId) || moved.has(edge.targetId))) {
                edgeRouting.set(edge.id, routers.route(edge));
            }
        }
    }
}

/** The point halfway along a route, measured along its length rather than halfway through its points. */
function polylineMiddle(route: Point[]): Point | undefined {
    if (route.length === 0) {
        return undefined;
    }
    const lengths = route.slice(1).map((point, index) => Math.hypot(point.x - route[index].x, point.y - route[index].y));
    let remaining = lengths.reduce((sum, length) => sum + length, 0) / 2;
    for (let index = 0; index < lengths.length; index++) {
        if (remaining <= lengths[index] && lengths[index] > 0) {
            const t = remaining / lengths[index];
            return {
                x: route[index].x + (route[index + 1].x - route[index].x) * t,
                y: route[index].y + (route[index + 1].y - route[index].y) * t
            };
        }
        remaining -= lengths[index];
    }
    return route[route.length - 1];
}
