/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
/** @jsx svg */
import { angleOfPoint, type GEdge, type Point, PolylineEdgeView, type RenderingContext, svg, toDegrees } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { type VNode } from 'snabbdom';

@injectable()
export class MessageEdgeView extends PolylineEdgeView {
    protected override renderAdditionals(edge: GEdge, segments: Point[], _context: RenderingContext): VNode[] {
        const p1 = segments[segments.length - 2];
        const p2 = segments[segments.length - 1];
        const flowEdge: any = [
            <path
                key={edge.id}
                class-sprotty-edge={true}
                class-arrow={true}
                d='M 1.5,0 L 10,-4 L 10,4 Z'
                transform={`rotate(${toDegrees(angleOfPoint({ x: p1.x - p2.x, y: p1.y - p2.y }))} 
                ${p2.x} ${p2.y}) translate(${p2.x} ${p2.y})`}
            />
        ];
        return flowEdge;
    }
}
