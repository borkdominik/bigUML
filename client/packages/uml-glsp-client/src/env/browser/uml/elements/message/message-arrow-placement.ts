/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import {
    angleOfPoint,
    EdgeLayoutPostprocessor,
    type EdgeRouterRegistry,
    type GEdge,
    type GModelElement,
    type Point,
    setAttr,
    toDegrees
} from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { type VNode } from 'snabbdom';
import { GMessageArrowLabel } from './message.element.js';

/**
 * Half the height of the arrow head, which is the part of a message arrow nearest the link whichever
 * way the link runs.
 */
const ARROW_HALF_HEIGHT = 6;

export interface MessageArrowGeometry {
    /** The point on the link the message is drawn beside. */
    point: Point;
    /** The direction the message travels there, in degrees, which its arrow is turned to follow. */
    angle: number;
    /** A unit vector pointing from the link towards the side this message is drawn on. */
    away: Point;
}

/**
 * Where a message is drawn beside its link, and which way round.
 *
 * GLSP places an edge label by whichever corner of it faces the line. That is the right answer for a
 * caption, but not for a message: which corner it picks - and so how far the label ends up from the
 * line - depends on the label's own width, so two messages on opposite sides of one link, one of them
 * a word longer than the other, are held different distances from it. A message is placed by its
 * arrow instead, which is the same size whatever the message is called, so the two sides of a link
 * mirror each other exactly.
 */
export function messageArrowGeometry(label: GMessageArrowLabel, edgeRouterRegistry: EdgeRouterRegistry): MessageArrowGeometry | undefined {
    const placement = label.edgePlacement;
    const edge = label.parent as GEdge | undefined;
    if (placement === undefined || edge === undefined) {
        return undefined;
    }

    const router = edgeRouterRegistry.get(edge.routerKind);
    const position = Math.min(1, Math.max(0, placement.position));
    const point = router.pointAt(edge, position);
    const tangent = router.derivativeAt(edge, position);
    if (point === undefined || tangent === undefined) {
        return undefined;
    }

    // Which side of the link a message takes has to be read off the link rather than off the message:
    // a reply runs back along the link its call came down, so measured from its own direction 'above
    // the link' would come out below it and the two would be drawn on top of each other. Pointing the
    // tangent rightwards first - downwards where the link is vertical - leaves every message on a link
    // the same two sides to choose between.
    const forwards = tangent.x < 0 || (tangent.x === 0 && tangent.y < 0) ? -1 : 1;
    const length = Math.hypot(tangent.x, tangent.y) || 1;
    // A quarter turn off the link. `side: 'bottom'` is taken to be the side above a link running to
    // the right, which is the side GLSP puts a label turned along the edge on and the side the server
    // names it by - see the note in `core/edge-label.tsx` on why the two sides read inverted.
    const towards = (placement.side === 'bottom' ? forwards : -forwards) / length;

    return {
        point,
        angle: toDegrees(angleOfPoint(tangent)),
        away: { x: tangent.y * towards, y: -tangent.x * towards }
    };
}

/**
 * Places the messages of a communication diagram beside their link, each one the same clearance off
 * it, and leaves every other label written along an edge to GLSP.
 */
@injectable()
export class MessageArrowLayoutPostprocessor extends EdgeLayoutPostprocessor {
    override decorate(vnode: VNode, element: GModelElement): VNode {
        if (!(element instanceof GMessageArrowLabel)) {
            return super.decorate(vnode, element);
        }

        const geometry = messageArrowGeometry(element, this.edgeRouterRegistry);
        if (geometry !== undefined) {
            // The label's origin is the middle of its arrow, so the clearance is measured out to the
            // head: what the offset holds clear of the link is then what is drawn nearest to it.
            const distance = (element.edgePlacement?.offset ?? 0) + ARROW_HALF_HEIGHT;
            const x = geometry.point.x + geometry.away.x * distance;
            const y = geometry.point.y + geometry.away.y * distance;
            setAttr(vnode, 'transform', `translate(${x}, ${y})`);
        }
        return vnode;
    }
}
