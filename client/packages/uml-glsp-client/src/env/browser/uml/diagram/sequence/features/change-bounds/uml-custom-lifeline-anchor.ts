/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { almostEquals, Bounds, type GConnectableElement, type Point, PolylineEdgeRouter, RectangleAnchor } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

export const UML_LIFELINE_ANCHOR_KIND = 'uml_lifeline';

@injectable()
export class SDLifelineAnchor extends RectangleAnchor {
    override get kind(): string {
        return PolylineEdgeRouter.KIND + ':' + UML_LIFELINE_ANCHOR_KIND;
    }

    override getAnchor(connectable: GConnectableElement, refPoint: Point, offset = 0): Point {
        const verticaloffset = 20;
        const bounds = connectable.bounds;
        const c = Bounds.center(bounds);
        const finder = new NearestPointFinder(c, refPoint);
        if (!almostEquals(c.x, refPoint.x)) {
            const yLeft = bounds.y + verticaloffset;
            if (yLeft >= bounds.y && yLeft <= bounds.y + bounds.height) {
                finder.addCandidate(bounds.x - offset, yLeft);
            }
            const yRight = bounds.y + verticaloffset;
            if (yRight >= bounds.y && yRight <= bounds.y + bounds.height) {
                finder.addCandidate(bounds.x + bounds.width + offset, yRight);
            }
        }
        return finder.best;
    }
}
class NearestPointFinder {
    protected currentBest: Point | undefined;
    protected currentDist = -1;

    constructor(
        protected centerPoint: Point,
        protected refPoint: Point
    ) {}

    addCandidate(x: number, y: number): void {
        const dx = this.refPoint.x - x;
        const dy = this.refPoint.y - y;
        const dist = dx * dx + dy * dy;
        if (this.currentDist < 0 || dist < this.currentDist) {
            this.currentBest = {
                x: x,
                y: y
            };
            this.currentDist = dist;
        }
    }

    get best(): Point {
        if (this.currentBest === undefined) {
            return this.centerPoint;
        } else {
            return this.currentBest;
        }
    }
}
