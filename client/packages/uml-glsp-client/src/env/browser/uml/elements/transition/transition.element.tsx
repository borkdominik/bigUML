/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { GEdge, GEdgeView, Point } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

export class GTransitionEdge extends GEdge {}

/**
 * Radius of the fillet drawn where a transition bends. A transition often has to travel around the
 * states between its two ends, so it bends far more than the relations of the structural diagrams -
 * rounding those bends is what keeps a long route reading as one line instead of a chain of corners.
 */
const CORNER_RADIUS = 20;

/** Below this the fillet is not worth drawing, and a zero-length one would emit a degenerate curve. */
const MIN_CORNER_RADIUS = 0.5;

/**
 * Kappa - how far along its tangent a cubic's control point has to sit for the curve to trace a
 * circle. Pulling the control points back from the corner by this fraction is what makes the fillet
 * a true arc; putting a single control point on the corner itself would cut visibly inside one.
 */
const CIRCLE_APPROXIMATION = 0.5523;

@injectable()
export class GTransitionEdgeView extends GEdgeView {
    /**
     * Draws the route with rounded instead of mitred bends. The base implementation joins the routed
     * points with plain line segments; each interior point is replaced here by an arc that leaves the
     * incoming segment early and rejoins the outgoing one late.
     *
     * Overriding this rather than `renderLine` also rounds the transparent mouse handle drawn on top
     * of the line, so the clickable area keeps following the line it belongs to.
     */
    protected override createPathForSegments(segments: Point[]): string {
        let path = `M ${segments[0].x},${segments[0].y}`;

        for (let i = 1; i < segments.length - 1; i++) {
            const [previous, corner, next] = [segments[i - 1], segments[i], segments[i + 1]];

            // Neither fillet may eat more than half of a segment, or the two corners sharing a short
            // one would overrun each other and the line would double back on itself.
            const radius = Math.min(
                CORNER_RADIUS,
                Point.euclideanDistance(previous, corner) / 2,
                Point.euclideanDistance(corner, next) / 2
            );
            if (radius < MIN_CORNER_RADIUS) {
                path += ` L ${corner.x},${corner.y}`;
                continue;
            }

            const entry = Point.shiftTowards(corner, previous, radius);
            const exit = Point.shiftTowards(corner, next, radius);
            const fromEntry = Point.shiftTowards(entry, corner, radius * CIRCLE_APPROXIMATION);
            const fromExit = Point.shiftTowards(exit, corner, radius * CIRCLE_APPROXIMATION);
            path += ` L ${entry.x},${entry.y} C ${fromEntry.x},${fromEntry.y} ${fromExit.x},${fromExit.y} ${exit.x},${exit.y}`;
        }

        const last = segments[segments.length - 1];
        return `${path} L ${last.x},${last.y}`;
    }
}
