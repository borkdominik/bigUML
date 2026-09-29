/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import {
    type Bounds,
    Bounds as BoundsUtil,
    type GConnectableElement,
    ManhattanEdgeRouter,
    ManhattanRectangularAnchor,
    type Point,
    PolylineEdgeRouter,
    RectangleAnchor
} from '@eclipse-glsp/client';
import { injectable } from 'inversify';

/** Anchor kind of the fork/join bar anchors, named on the nodes that want them. */
export const UML_BAR_ANCHOR_KIND = 'uml_bar';

/**
 * The point on a fork/join bar an edge arriving from `refPoint` connects to, or `undefined` when the
 * edge comes in diagonally from off the end of the bar and there is no face below it to drop it onto.
 *
 * The stock rectangular anchor aims every edge at the node's centre, which is right for a shape wide
 * enough to aim at but not for a bar: a fork with three outgoing transitions puts all three through
 * the centre, so they leave within a few pixels of each other in the middle of a bar 120 long, fanning
 * out at an angle. A fork drawn that way says the opposite of what it means - the parallel flows it
 * splits into should leave the bar spread along it and square to it, the way UML draws them.
 *
 * So an edge is met where it arrives rather than aimed at the centre: the reference point is dropped
 * perpendicular onto the face it lies over, which spreads the ends along the bar and squares every one
 * of them to it.
 */
function barFace(bounds: Bounds, refPoint: Point, offset: number): Point | undefined {
    if (bounds.width <= 0 || bounds.height <= 0) {
        return undefined;
    }

    const center = BoundsUtil.center(bounds);
    // A point can be dropped onto the top or bottom face only while it is over the bar's width, and
    // onto the left or right face only while it is over its height.
    const overTopOrBottom = refPoint.x >= bounds.x && refPoint.x <= bounds.x + bounds.width;
    const overLeftOrRight = refPoint.y >= bounds.y && refPoint.y <= bounds.y + bounds.height;
    // Which pair of faces is the long one follows from the bounds alone, the same way the view works
    // out which way to draw the bar - a bar stood upright is one dragged taller than it is wide.
    const longFacesAreTopAndBottom = bounds.width >= bounds.height;

    // The long faces are offered first, since those are the ones the parallel flows spread along.
    // Both are only possible at once for a point inside the bar, where either face will do.
    if (overTopOrBottom && (longFacesAreTopAndBottom || !overLeftOrRight)) {
        const y = refPoint.y < center.y ? bounds.y - offset : bounds.y + bounds.height + offset;
        return { x: refPoint.x, y };
    }
    if (overLeftOrRight) {
        const x = refPoint.x < center.x ? bounds.x - offset : bounds.x + bounds.width + offset;
        return { x, y: refPoint.y };
    }
    return undefined;
}

/**
 * Both routers get the anchor, for the reason given on the diamond tips: where a shape takes its edges
 * is a property of the shape. Each variant falls back to the stock rectangular anchor of its own router
 * for the diagonal case, so an edge with no face to drop onto behaves exactly as it does today.
 */
@injectable()
export class UmlPolylineBarAnchor extends RectangleAnchor {
    override get kind(): string {
        return PolylineEdgeRouter.KIND + ':' + UML_BAR_ANCHOR_KIND;
    }

    override getAnchor(connectable: GConnectableElement, refPoint: Point, offset = 0): Point {
        return barFace(connectable.bounds, refPoint, offset) ?? super.getAnchor(connectable, refPoint, offset);
    }
}

@injectable()
export class UmlManhattanBarAnchor extends ManhattanRectangularAnchor {
    override get kind(): string {
        return ManhattanEdgeRouter.KIND + ':' + UML_BAR_ANCHOR_KIND;
    }

    override getAnchor(connectable: GConnectableElement, refPoint: Point, offset = 0): Point {
        return barFace(connectable.bounds, refPoint, offset) ?? super.getAnchor(connectable, refPoint, offset);
    }
}
