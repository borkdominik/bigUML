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
    type IAnchorComputer,
    ManhattanEdgeRouter,
    type Point,
    PolylineEdgeRouter
} from '@eclipse-glsp/client';
import { injectable } from 'inversify';

/** Anchor kind of the diamond tip anchors, named on the nodes that want them. */
export const UML_DIAMOND_TIP_ANCHOR_KIND = 'uml_diamond_tip';

/**
 * The point of a branch diamond an edge arriving from `refPoint` connects to.
 *
 * UML draws a choice with its transitions on the top, right, bottom and left points of the diamond -
 * the branch reads as one flow arriving and several leaving, which only holds if they meet the shape
 * where its axes do. Sprotty's own `DiamondAnchor` stops an edge wherever it happens to cross a sloped
 * side, so a transition from a state off to one corner lands halfway up an edge of the shape, and a
 * choice with three of them has its transitions scattered around the outline.
 *
 * Which of the four an edge gets is settled by the direction it comes from, measured against the
 * diamond's own corners rather than against a flat 45 degrees: `|dx|/width` against `|dy|/height` is
 * the comparison that puts the changeover exactly on the diagonal of a diamond of any proportion, so a
 * wide one hands more of the surrounding space to its left and right tips, as its shape suggests.
 */
function diamondTip(bounds: Bounds, refPoint: Point, offset: number): Point {
    const center = BoundsUtil.center(bounds);
    if (bounds.width <= 0 || bounds.height <= 0) {
        return center;
    }

    const dx = refPoint.x - center.x;
    const dy = refPoint.y - center.y;

    // The offset is what keeps an arrow head off the shape, so it pushes the tip outwards along the
    // axis it sits on - the one direction that stays on the edge's own line into the point.
    if (Math.abs(dx) * bounds.height >= Math.abs(dy) * bounds.width) {
        const x = dx >= 0 ? bounds.x + bounds.width + offset : bounds.x - offset;
        return { x, y: center.y };
    }
    const y = dy >= 0 ? bounds.y + bounds.height + offset : bounds.y - offset;
    return { x: center.x, y };
}

/**
 * Both routers get the anchor, because the shape's connection points are a property of the shape and
 * not of how an edge reaching them is routed. A transition routes orthogonally and a diamond it meets
 * head on needs nothing more; the polyline variant is what keeps every other edge that ends on one of
 * these shapes - and the rubber band drawn while a new edge is being pulled - on the same four points.
 */
@injectable()
export class UmlPolylineDiamondTipAnchor implements IAnchorComputer {
    get kind(): string {
        return PolylineEdgeRouter.KIND + ':' + UML_DIAMOND_TIP_ANCHOR_KIND;
    }

    getAnchor(connectable: GConnectableElement, refPoint: Point, offset = 0): Point {
        return diamondTip(connectable.bounds, refPoint, offset);
    }
}

@injectable()
export class UmlManhattanDiamondTipAnchor implements IAnchorComputer {
    get kind(): string {
        return ManhattanEdgeRouter.KIND + ':' + UML_DIAMOND_TIP_ANCHOR_KIND;
    }

    getAnchor(connectable: GConnectableElement, refPoint: Point, offset = 0): Point {
        return diamondTip(connectable.bounds, refPoint, offset);
    }
}
