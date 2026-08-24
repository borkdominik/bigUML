/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
/** @jsx svg */
import { EdgeRouterRegistry, getSubType, GLabelView, type Point, type RenderingContext, setAttr, svg } from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { type VNode } from 'snabbdom';
import { messageArrowGeometry } from './message-arrow-placement.js';
import { type GMessageArrowLabel } from './message.element.js';

/**
 * The label of a message on a communication diagram, written beside the link with a short arrow
 * showing which way the message runs.
 *
 * A communication diagram puts the messages *beside* the link rather than on it - the link is an
 * association between two lifelines and carries no direction of its own, while several messages can
 * run along it in either direction, each with its own sequence number. So the arrow belongs to the
 * label, not to the edge, which is why it is drawn here.
 */

/** How far off the arrow the message text is written. */
const TEXT_GAP = 10;

/** How far the text is pushed to one side before it is hung off that edge rather than centred. */
const TEXT_CORNER = 0.5;

/** Where the text goes when the link cannot be measured: above the arrow, as for a horizontal link. */
const FALLBACK_DIRECTION: Point = { x: 0, y: -1 };

/**
 * The arrow, pointing right, drawn about the label's own origin - which the placement has already put
 * a fixed clearance off the link - so that turning it to follow the link needs no further translation.
 * Stroked rather than filled, with an open head, which is how UML draws a message arrow.
 */
const ARROW_PATH = 'M -12.5,0 L 12.5,0 M 5.5,-6 L 12.5,0 L 5.5,6';

@injectable()
export class MessageArrowLabelView extends GLabelView {
    @inject(EdgeRouterRegistry) edgeRouterRegistry: EdgeRouterRegistry;

    override render(labelNode: Readonly<GMessageArrowLabel>, _context: RenderingContext): VNode {
        // Only the arrow turns: the text is written upright whichever way the link runs, because a
        // sequence number read sideways is not worth the tidiness. It is written on the far side of
        // the arrow - away from the link, along the same direction the placement moved the arrow -
        // since between the two it would be laid back over the link it labels.
        const geometry = messageArrowGeometry(labelNode, this.edgeRouterRegistry);
        const away = geometry?.away ?? FALLBACK_DIRECTION;

        const vnode: any = (
            <g class-selected={labelNode.selected} class-sprotty-label-node={true}>
                <path class-uml-message-arrow={true} d={ARROW_PATH} transform={`rotate(${geometry?.angle ?? 0})`} />
                {/* Hung off whichever edge of the text faces the link, so that a long message name
                    grows away from the link rather than back across it. */}
                <text
                    class-sprotty-label={true}
                    x={away.x * TEXT_GAP}
                    y={away.y * TEXT_GAP}
                    style-text-anchor={horizontalAnchor(away.x)}
                    style-dominant-baseline={verticalAnchor(away.y)}
                >
                    {labelNode.text}
                </text>
            </g>
        );

        const subType = getSubType(labelNode);
        if (subType) {
            setAttr(vnode, 'class', subType);
        }
        return vnode;
    }
}

/** Written from the arrow outwards, or centred over it where the link runs too flat to say. */
function horizontalAnchor(x: number): string {
    if (x > TEXT_CORNER) {
        return 'start';
    }
    return x < -TEXT_CORNER ? 'end' : 'middle';
}

/** The same, for a link running too steeply for the text to be written above or below its arrow. */
function verticalAnchor(y: number): string {
    if (y > TEXT_CORNER) {
        return 'hanging';
    }
    return y < -TEXT_CORNER ? 'auto' : 'middle';
}
