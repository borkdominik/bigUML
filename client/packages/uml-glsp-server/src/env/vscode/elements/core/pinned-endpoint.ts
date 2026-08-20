/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import {
    type ConnectionPoint,
    type ConnectionPointLayout,
    connectionPointId,
    offeredConnectionPoints,
    turnableDefaultSize
} from '@borkdominik-biguml/uml-glsp-server';
import {
    isChoice,
    isDecisionNode,
    isFork,
    isForkNode,
    isJoin,
    isJoinNode,
    isMergeNode,
    isOpaqueAction
} from '@borkdominik-biguml/uml-model-server/grammar';
import type { ElementContext } from './element-context.js';

/**
 * Resolving a pinned end of an edge, shared by the two edges that can hold a pin - the state machine's
 * transition and the activity diagram's control flow. The two run between the same shapes drawn the
 * same way, so a pin has to mean the same thing on both.
 */

/** How an element lays its connection points out, or `undefined` for the shapes that have none. */
function layoutOf(node: unknown): ConnectionPointLayout | undefined {
    if (isChoice(node) || isDecisionNode(node) || isMergeNode(node)) {
        return 'diamond';
    }
    if (isFork(node) || isJoin(node) || isForkNode(node) || isJoinNode(node)) {
        return 'bar';
    }
    // The action offers the same two side points its pins sit on, so a flow dropped on one of those dots
    // is pinned there and stays pinned - without this the point would be recorded and then ignored on
    // the next read, and the flow would spring back to the middle of the shape.
    if (isOpaqueAction(node)) {
        return 'sides';
    }
    return undefined;
}

/**
 * The element an edge attaches to at one end: the port on a pinned connection point, or the shape
 * itself when that end is not pinned. An unpinned end still lands on a point - the client's anchor puts
 * it there - it is simply free to move between them as the diagram does, which is the difference.
 *
 * A pin is only honoured when the shape still offers that point. A bar's two points are the middle of
 * its long faces, and which faces those are is its size, so standing a bar upright turns its `NORTH`
 * and `SOUTH` into `WEST` and `EAST`. An edge pinned to the old face would otherwise name a port that
 * is no longer emitted, leaving it hanging off an element id that is not in the model. Falling back to
 * the shape is what a turned bar should do anyway: the flow keeps crossing it.
 */
export function pinnedEndpointId(ctx: ElementContext, elementId: string, node: unknown, point: ConnectionPoint | undefined): string {
    const layout = point ? layoutOf(node) : undefined;
    if (!layout) {
        return elementId;
    }

    const stored = ctx.modelIndex.findSize(elementId);
    // Mirrors the shape elements, which fall back to their default size on bounds that were never set
    // or were stored as zero - the points have to sit on the shape that is actually drawn.
    const size = stored?.width && stored?.height && stored.width > 0 && stored.height > 0 ? stored : turnableDefaultSize(node);
    if (!size) {
        return elementId;
    }

    return offeredConnectionPoints(layout, size).includes(point!) ? connectionPointId(elementId, point!) : elementId;
}
