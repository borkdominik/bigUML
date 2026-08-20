/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
/** @jsx svg */
import { type GNode, RectangularNodeView, type RenderingContext, svg } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { type VNode } from 'snabbdom';

/**
 * The circles UML draws for the ends of a flow. Each is drawn to the node's own bounds, so the
 * selection outline and the points edges anchor to all line up with the shape. None of them is
 * named: a circle this size has no room to hold a name, and one written beside it only crowds the
 * flow running into it.
 *
 * The colours come from the theme rather than from the view: what these carried before - `#4E81B4`
 * for the activity nodes, `white` for the state machine ones - are the border colour of the light and
 * the dark theme respectively, so each was right in exactly one of the two.
 */

/** Of the circle's radius, how much of it the disc inside a final node takes. */
const INNER_DISC_RATIO = 0.6;

/** Of the circle's radius, how far the arms of a flow final's cross reach. */
const CROSS_RATIO = 0.55;

function geometry(node: Readonly<GNode>): { cx: number; cy: number; radius: number } {
    const size = { width: Math.max(0, node.bounds.width), height: Math.max(0, node.bounds.height) };
    return { cx: size.width / 2, cy: size.height / 2, radius: Math.min(size.width, size.height) / 2 };
}

/** Where an activity begins: a disc filled solid. */
@injectable()
export class InitialControlNodeView extends RectangularNodeView {
    override render(node: Readonly<GNode>, context: RenderingContext): VNode | undefined {
        if (!this.isVisible(node, context)) {
            return undefined;
        }
        const { cx, cy, radius } = geometry(node);

        return (
            <g class-selected={node.selected} class-mouseover={node.hoverFeedback}>
                <circle cx={cx} cy={cy} r={radius} class-uml-control-node-fill />
                {context.renderChildren(node)}
            </g>
        ) as any;
    }
}

/** Where an activity finishes: a disc inside a ring. */
@injectable()
export class ActivityFinalNodeView extends RectangularNodeView {
    override render(node: Readonly<GNode>, context: RenderingContext): VNode | undefined {
        if (!this.isVisible(node, context)) {
            return undefined;
        }
        const { cx, cy, radius } = geometry(node);

        return (
            <g class-selected={node.selected} class-mouseover={node.hoverFeedback}>
                <circle cx={cx} cy={cy} r={radius} class-uml-node-background />
                <circle cx={cx} cy={cy} r={radius * INNER_DISC_RATIO} class-uml-control-node-fill />
                {context.renderChildren(node)}
            </g>
        ) as any;
    }
}

/** Where one flow of an activity finishes while the rest carry on: a cross inside a ring. */
@injectable()
export class FlowFinalNodeView extends RectangularNodeView {
    override render(node: Readonly<GNode>, context: RenderingContext): VNode | undefined {
        if (!this.isVisible(node, context)) {
            return undefined;
        }
        const { cx, cy, radius } = geometry(node);
        const arm = radius * CROSS_RATIO;

        return (
            <g class-selected={node.selected} class-mouseover={node.hoverFeedback}>
                <circle cx={cx} cy={cy} r={radius} class-uml-node-background />
                <line x1={cx - arm} y1={cy - arm} x2={cx + arm} y2={cy + arm} class-uml-control-node-cross />
                <line x1={cx - arm} y1={cy + arm} x2={cx + arm} y2={cy - arm} class-uml-control-node-cross />
                {context.renderChildren(node)}
            </g>
        ) as any;
    }
}
