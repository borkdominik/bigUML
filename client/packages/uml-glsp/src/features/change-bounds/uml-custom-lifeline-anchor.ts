/********************************************************************************
 * Copyright (c) 2019-2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
import { Bounds, Point, PolylineEdgeRouter, RectangleAnchor, SConnectableElement, almostEquals } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

export const UML_LIFELINE_ANCHOR_KIND = 'uml_lifeline';

@injectable()
export class UmlLifelineAnchor extends RectangleAnchor {
    override get kind() {
        return PolylineEdgeRouter.KIND + ':' + UML_LIFELINE_ANCHOR_KIND;
    }

    override getAnchor(connectable: SConnectableElement, refPoint: Point, offset = 0): Point {
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

    constructor(protected centerPoint: Point, protected refPoint: Point) {}

    addCandidate(x: number, y: number) {
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
