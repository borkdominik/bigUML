/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { type ConnectionPoint, connectionPointId, offeredConnectionPoints } from '@borkdominik-biguml/uml-glsp-server';
import { connectionPointLayoutOf } from '../../geometry/connection-point-layout.js';
import { nodeSize } from '../../geometry/node-size.js';
import type { ElementContext } from './element-context.js';

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
    const layout = point ? connectionPointLayoutOf(node) : undefined;
    if (!layout) {
        return elementId;
    }

    // The points have to sit on the shape that is actually drawn, which falls back to the type's
    // default size on bounds that were never set or were stored as zero - as the shape elements do.
    const size = nodeSize((node as { $type: string }).$type, ctx.modelIndex.findSize(elementId));
    return offeredConnectionPoints(layout, size).includes(point!) ? connectionPointId(elementId, point!) : elementId;
}
