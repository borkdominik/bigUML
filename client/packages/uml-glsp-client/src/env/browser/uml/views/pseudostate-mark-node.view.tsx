/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
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
import { hitAreaBox } from './hit-area.js';
import { outsideLabel } from './outside-label.js';

/**
 * The pseudostates drawn as a small mark rather than as a shape holding a name: the two points on the
 * border of a state machine or a composite state, and the terminate cross. Drawn together so the crosses
 * two of them carry cannot drift apart.
 *
 * Each writes its name beside the mark rather than in it. All three are named - the name is how a
 * transition crossing the border is read - but a mark 30 across has nowhere to hold one; see
 * `outsideLabel` for why the view writes it instead of laying it out as a child.
 */

/** Half the stroke a cross is drawn with, so its ends stop where the shape does rather than past it. */
const STROKE_INSET = 1;

/** The two diagonals of a cross centred on `cx`,`cy`, each arm reaching `arm` from the centre. */
function cross(cx: number, cy: number, arm: number): VNode[] {
    return [
        (<line x1={cx - arm} y1={cy - arm} x2={cx + arm} y2={cy + arm} class-uml-pseudostate-cross />) as any,
        (<line x1={cx - arm} y1={cy + arm} x2={cx + arm} y2={cy - arm} class-uml-pseudostate-cross />) as any
    ];
}

/** The square a mark is drawn in: the node's bounds taken to their shorter side, and its centre. */
function geometry(node: Readonly<GNode>): { size: { width: number; height: number }; cx: number; cy: number; radius: number } {
    const size = { width: Math.max(0, node.bounds.width), height: Math.max(0, node.bounds.height) };
    return { size, cx: size.width / 2, cy: size.height / 2, radius: Math.min(size.width, size.height) / 2 };
}

/** The two points on a state's border, which are a circle differing only in what is drawn inside it. */
@injectable()
export abstract class PseudostateCircleNodeView extends RectangularNodeView {
    override render(node: Readonly<GNode>, context: RenderingContext): VNode | undefined {
        if (!this.isVisible(node, context)) {
            return undefined;
        }

        const { size, cx, cy, radius } = geometry(node);

        return (
            <g class-selected={node.selected} class-mouseover={node.hoverFeedback}>
                <circle cx={cx} cy={cy} r={radius} class-uml-node-background />
                {this.mark(cx, cy, radius)}
                {outsideLabel(node, size, 'below')}
                {context.renderChildren(node)}
            </g>
        ) as any;
    }

    /** What is drawn inside the circle, if anything. */
    protected abstract mark(cx: number, cy: number, radius: number): VNode[];
}

/**
 * Where a state machine or a composite state is entered: a circle with nothing in it.
 *
 * Left hollow, which is what tells it apart from the filled disc of an initial state - the two are
 * otherwise the same shape at the same size.
 */
@injectable()
export class EntryPointNodeView extends PseudostateCircleNodeView {
    protected override mark(): VNode[] {
        return [];
    }
}

/**
 * Where a state machine or a composite state is left: a cross drawn across the circle.
 *
 * Unlike the crossed circle a flow final node is drawn as - which keeps its arms well inside the ring -
 * the arms here run out to the ring itself, which is what tells the two notations apart at a glance.
 */
@injectable()
export class ExitPointNodeView extends PseudostateCircleNodeView {
    protected override mark(cx: number, cy: number, radius: number): VNode[] {
        // Where the ring stands at 45 degrees, which is where an arm of the cross has to end to touch it.
        return cross(cx, cy, Math.max(0, radius - STROKE_INSET) * Math.SQRT1_2);
    }
}

/**
 * Where a state machine stops altogether: a cross on its own, with no ring around it.
 *
 * Reaching one ends execution there and then, so nothing leaves it and there is no border being crossed
 * to draw a circle for - which is exactly what separates it from an exit point. The arms run to the
 * corners of the node's square rather than to a ring inside it, so the mark reads at the same weight as
 * a circle of the same size standing beside it.
 */
@injectable()
export class TerminateNodeView extends RectangularNodeView {
    override render(node: Readonly<GNode>, context: RenderingContext): VNode | undefined {
        if (!this.isVisible(node, context)) {
            return undefined;
        }

        const { size, cx, cy, radius } = geometry(node);

        return (
            <g class-selected={node.selected} class-mouseover={node.hoverFeedback}>
                {/* Two lines two pixels wide are the whole of this shape, so what can be aimed at has to
                    be put there deliberately - unlike the circles above, which are filled. */}
                {hitAreaBox(size.width, size.height)}
                {cross(cx, cy, Math.max(0, radius - STROKE_INSET))}
                {outsideLabel(node, size, 'below')}
                {context.renderChildren(node)}
            </g>
        ) as any;
    }
}
