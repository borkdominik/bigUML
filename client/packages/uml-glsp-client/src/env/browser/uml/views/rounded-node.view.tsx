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
import { renderCompartmentSeparators } from './compartment-separator.js';
import { hitStrokeBox } from './hit-area.js';

/**
 * The rounded box UML draws for a state and for an action. One view for both: the notation is the same
 * shape, and the two had no business rounding their corners differently.
 *
 * Whatever the shape holds - a name, the compartments of a state, the pins on an action's boundary - is
 * rendered as its children, so this draws the outline, the lines dividing those compartments, and
 * nothing else. A shape carrying no compartments to divide gets no lines.
 */

/**
 * The corner rounding is relative, not fixed: a shape keeps the same silhouette whether it is a wide,
 * flat box or dragged out into a tall one. Tying it to the shorter side is what keeps the two arcs of
 * that side from meeting - at a fifth of it they take up two fifths of the side and leave a straight
 * segment in between, which is what the UML notation shows.
 */
const CORNER_RADIUS_RATIO = 1 / 5;

@injectable()
export class RoundedNodeView extends RectangularNodeView {
    /**
     * How far the corners are taken off. Proportional, which is what a shape drawn to the size of its own
     * name wants - a frame drawn around other shapes does not, and overrides this with a flat number.
     *
     * The element is passed because a shape can be both: a state is a box the size of its name until it
     * is given a region, and the frame its substates stand on from then on - see `StateNodeView`.
     */
    protected cornerRadius(_element: Readonly<GNode>, width: number, height: number): number {
        return Math.min(width, height) * CORNER_RADIUS_RATIO;
    }

    override render(element: Readonly<GNode>, context: RenderingContext): VNode | undefined {
        if (!this.isVisible(element, context)) {
            return undefined;
        }

        const width = Math.max(0, element.bounds.width);
        const height = Math.max(0, element.bounds.height);
        const radius = this.cornerRadius(element, width, height);

        return (
            <g class-selected={element.selected} class-mouseover={element.hoverFeedback}>
                {/* Under the shape, so a click on the shape itself still reaches it first. It is the
                    unfilled ones this is for - a composite state is a border around nothing, and a
                    border is a pixel wide. */}
                {hitStrokeBox(width, height, radius)}
                <rect x={0} y={0} rx={radius} ry={radius} width={width} height={height} class-uml-node-background />
                {/* The rules stop on the outline rather than running the full width: at the height of a
                    corner the sides of this shape are not at 0 and at the width, and a rule drawn to
                    those ran out through the curve and past the border on both sides. */}
                {renderCompartmentSeparators(element, radius)}
                {context.renderChildren(element)}
            </g>
        ) as any;
    }
}
