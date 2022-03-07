/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
/* eslint-disable react/jsx-key */
import { injectable } from "inversify";
import { VNode } from "snabbdom";
import {
    toDegrees,
    angleOfPoint,
    SEdge,
    Point,
    PolylineEdgeView,
    RenderingContext,
    svg
} from "sprotty/lib";

/* eslint-disable react/react-in-jsx-scope */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = { createElement: svg };

@injectable()
export class ExceptionHandlerEdgeView extends PolylineEdgeView {
    protected renderLine(edge: SEdge, segments: Point[], context: RenderingContext): VNode {
        const source = segments[0];
        const target = segments[segments.length - 1];

        const middle: Point = {
            x: (source.x + target.x) / 2,
            y: (source.y + target.y) / 2
        };
        const p1 = rotate(source, middle, 10);
        const p2Help: Point = {
            x: (source.x + p1.x) / 2,
            y: (source.y + p1.y) / 2
        };
        const p2 = rotate(p1, p2Help, 20);

        let path = `M ${source.x},${source.y}`;
        path += ` L ${p1.x},${p1.y}`;
        path += ` L ${p2.x},${p2.y}`;
        path += ` L ${target.x},${target.y}`;
        const exceptionHandlerEdge: any =(<path d={path} />);
        return exceptionHandlerEdge;
    }

    protected renderAdditionals(edge: SEdge, segments: Point[], context: RenderingContext): VNode[] {
        const p1 = segments[segments.length - 2];
        const p2 = segments[segments.length - 1];
        const additionals: any = ([
            <path key={edge.id} class-sprotty-edge={true} class-arrow={true} d="M 1.5,0 L 10,-4 L 10,4 Z"
                transform={`rotate(${toDegrees(angleOfPoint({ x: p1.x - p2.x, y: p1.y - p2.y }))} ${p2.x} ${p2.y}) translate(${p2.x} ${p2.y})`} />
        ]);
        return additionals;
    }
}

/**
 * Rotates the given point around the center point with the given deg.
 * @param center Center point.
 * @param point Point to rotate.
 * @param deg Angle given in degree.
 */
function rotate(center: Point, point: Point, deg: number): Point {
    const rad = deg * Math.PI / 180;
    const s = Math.sin(rad);
    const c = Math.cos(rad);
    return {
        x: c * (point.x - center.x) - s * (point.y - center.y) + center.x,
        y: s * (point.x - center.x) + c * (point.y - center.y) + center.y
    };
}

/**
 * Returns the angle between p1 and p2 in degree.
 * @param p1 Point 1.
 * @param p2 Point 2.
 */
export function angle(p1: Point, p2: Point): number {
    let theta = Math.atan2(p2.x - p1.x, p2.y - p1.y);
    if (theta < 0) {
        theta += Math.PI * 2;
    }
    return theta * 180 / Math.PI;
}

/**
 * Scales from the center into the given direction with the given len.
 * @param center Center point to scale from.
 * @param deg Direction as angle given in degree.
 * @param len Distance to the center point.
 */
export function scale(center: Point, deg: number, len: number): Point {
    const rad = deg * Math.PI / 180;
    const nx = Math.cos(rad) * len + center.x;
    const ny = Math.sin(rad) * len + center.y;
    return { x: nx, y: ny };
}

/**
 * Distance between the two points.
 * @param p1 Point 1.
 * @param p2 Point 2.
 */
export function distance(p1: Point, p2: Point): number {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}
