/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import {
    Bounds,
    type GConnectableElement,
    type IAnchorComputer,
    ManhattanEdgeRouter,
    Point,
    PolylineEdgeRouter
} from '@eclipse-glsp/client';
import { injectable } from 'inversify';

/** Anchor kind of the centre anchors, named on the elements that want them. */
export const UML_CENTER_ANCHOR_KIND = 'uml_center';

/**
 * Anchors an edge to the middle of an element rather than to its outline.
 *
 * For a connection point, the element *is* the place the edge belongs: the port sits centred on a tip
 * of the choice diamond, and the edge is meant to end on that tip exactly. Its bounds are a hit area
 * and nothing else - a point cannot be clicked, so the port is drawn a good deal larger than the dot it
 * shows - and an anchor on that outline would leave the edge half the hit area short of the tip.
 */
function elementCenter(bounds: Bounds, refPoint: Point, offset: number): Point {
    const center = Bounds.center(bounds);
    // Backing off along the line the edge arrives on keeps an arrow head from covering the point it
    // is aimed at, without moving the end off the tip's axis.
    return offset === 0 ? center : Point.shiftTowards(center, refPoint, offset);
}

@injectable()
export class UmlPolylineCenterAnchor implements IAnchorComputer {
    get kind(): string {
        return PolylineEdgeRouter.KIND + ':' + UML_CENTER_ANCHOR_KIND;
    }

    getAnchor(connectable: GConnectableElement, refPoint: Point, offset = 0): Point {
        return elementCenter(connectable.bounds, refPoint, offset);
    }
}

@injectable()
export class UmlManhattanCenterAnchor implements IAnchorComputer {
    get kind(): string {
        return ManhattanEdgeRouter.KIND + ':' + UML_CENTER_ANCHOR_KIND;
    }

    getAnchor(connectable: GConnectableElement, refPoint: Point, offset = 0): Point {
        return elementCenter(connectable.bounds, refPoint, offset);
    }
}
