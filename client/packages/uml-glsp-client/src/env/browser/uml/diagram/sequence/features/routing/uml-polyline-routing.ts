/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { Bounds, type GRoutableElement, Point, type RoutedPoint } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { UmlPolylineEdgeRouter } from '../../../../../features/routing/package-merge-router.js';
import { LifelineElement } from '../../elements/index.js';

/**
 * Anchors an edge arriving at a lifeline to its head rather than to its middle.
 *
 * Built on `UmlPolylineEdgeRouter` and standing aside for it on everything else, because there is only
 * one router to be had: a diagram's edges are routed by whichever router holds the polyline kind, and
 * only one can. What is peculiar to a sequence diagram is added to what every diagram is drawn with,
 * rather than taking its place.
 */
// TODO: Sequence Diagram Specific
@injectable()
export class SDPolylineEdgeRouter extends UmlPolylineEdgeRouter {
    override route(edge: GRoutableElement): RoutedPoint[] {
        const source = edge.source;
        const target = edge.target;
        if (source === undefined || target === undefined) {
            return [];
        }
        if (!(target instanceof LifelineElement)) {
            return super.route(edge);
        }

        let sourceAnchor: Point;
        let targetAnchor: Point;
        const options = this.getOptions(edge);
        const routingPoints = edge.routingPoints.length > 0 ? edge.routingPoints : [];
        this.cleanupRoutingPoints(edge, routingPoints, false, false);
        const rpCount = routingPoints !== undefined ? routingPoints.length : 0;
        if (rpCount === 0) {
            // The head of the lifeline rather than its middle, which is the point the edge is aimed at.
            const startRef = Point.add(Bounds.center(target.bounds), {
                x: 0,
                y: target.headerHeight() / 2 - target.bounds.height / 2
            });
            sourceAnchor = this.getTranslatedAnchor(source, startRef, target.parent, edge, edge.sourceAnchorCorrection);
            // Use the source center as end anchor reference
            const endRef = Bounds.center(source.bounds);
            targetAnchor = this.getTranslatedAnchor(target, endRef, source.parent, edge, edge.targetAnchorCorrection);
        } else {
            // Use the first routing point as start anchor reference
            const p0 = routingPoints[0];
            sourceAnchor = this.getTranslatedAnchor(source, p0, edge.parent, edge, edge.sourceAnchorCorrection);
            // Use the last routing point as end anchor reference
            const pn = routingPoints[rpCount - 1];
            targetAnchor = this.getTranslatedAnchor(target, pn, edge.parent, edge, edge.targetAnchorCorrection);
        }

        const result: RoutedPoint[] = [];
        result.push({ kind: 'source', x: sourceAnchor.x, y: sourceAnchor.y });
        for (let i = 0; i < rpCount; i++) {
            const p = routingPoints[i];
            if (
                (i > 0 && i < rpCount - 1) ||
                (i === 0 && Point.maxDistance(sourceAnchor, p) >= options.minimalPointDistance + (edge.sourceAnchorCorrection || 0)) ||
                (i === rpCount - 1 &&
                    Point.maxDistance(p, targetAnchor) >= options.minimalPointDistance + (edge.targetAnchorCorrection || 0))
            ) {
                result.push({ kind: 'linear', x: p.x, y: p.y, pointIndex: i });
            }
        }
        result.push({ kind: 'target', x: targetAnchor.x, y: targetAnchor.y });
        return this.filterEditModeHandles(result, edge, options);
    }
}
