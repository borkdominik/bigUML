/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { Bounds, type GRoutableElement, Point, PolylineEdgeRouter, type RoutedPoint } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { LifelineElement } from '../../elements/index.js';

// TODO: Sequence Diagram Specific
@injectable()
export class SDPolylineEdgeRouter extends PolylineEdgeRouter {
    override route(edge: GRoutableElement): RoutedPoint[] {
        const source = edge.source;
        const target = edge.target;
        if (source === undefined || target === undefined) {
            return [];
        }

        let sourceAnchor: Point;
        let targetAnchor: Point;
        const options = this.getOptions(edge);
        const routingPoints = edge.routingPoints.length > 0 ? edge.routingPoints : [];
        this.cleanupRoutingPoints(edge, routingPoints, false, false);
        const rpCount = routingPoints !== undefined ? routingPoints.length : 0;
        if (rpCount === 0) {
            // Use the target center as start anchor reference
            let startRef = Bounds.center(target.bounds);
            // TODO: Sequence diagram specific
            if (target instanceof LifelineElement) {
                startRef = Point.add(startRef, { x: 0, y: target.headerHeight() / 2 - target.bounds.height / 2 });
            }
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
