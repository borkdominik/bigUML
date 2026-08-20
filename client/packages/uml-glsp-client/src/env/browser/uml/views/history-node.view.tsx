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
import { outsideLabel } from './outside-label.js';

/**
 * The history pseudostates of a state machine: a circle carrying `H` for a shallow history and `H*` for
 * a deep one. One view for both, since the notation differs only in that mark.
 *
 * The mark is drawn as text rather than assembled out of line segments, which is what the two views
 * this replaces did - a dozen `<line>` elements each, hand-placed by fractions of the radius. That
 * spelled `H` well enough but had no way to put a `*` beside it, so the deep history's star was laid
 * over the top half of its own `H`. Text also scales with the shape for free, and picks up the theme
 * rather than the fixed `#4E81B4` and `#ffffff` those views painted with - a white mark that was very
 * nearly invisible against a light node.
 */
@injectable()
export abstract class HistoryNodeView extends RectangularNodeView {
    /** The mark written inside the circle. */
    protected abstract get glyph(): string;

    override render(node: Readonly<GNode>, context: RenderingContext): VNode | undefined {
        if (!this.isVisible(node, context)) {
            return undefined;
        }

        const size = { width: Math.max(0, node.bounds.width), height: Math.max(0, node.bounds.height) };
        const radius = Math.min(size.width, size.height) / 2;
        // `H*` has to carry a second glyph across the same circle, so it is set smaller to keep the
        // mark clear of the border at any size the node is dragged to.
        const fontSize = radius * (this.glyph.length > 1 ? 0.85 : 1.1);

        return (
            <g class-selected={node.selected} class-mouseover={node.hoverFeedback}>
                <circle cx={size.width / 2} cy={size.height / 2} r={radius} class-uml-node-background />
                <text
                    class-uml-history-glyph={true}
                    x={size.width / 2}
                    y={size.height / 2}
                    style-font-size={`${fontSize}px`}
                    style-text-anchor='middle'
                    style-dominant-baseline='central'
                >
                    {this.glyph}
                </text>
                {outsideLabel(node, size, 'below')}
                {context.renderChildren(node)}
            </g>
        ) as any;
    }
}

@injectable()
export class DeepHistoryNodeView extends HistoryNodeView {
    protected override get glyph(): string {
        return 'H*';
    }
}

@injectable()
export class ShallowHistoryNodeView extends HistoryNodeView {
    protected override get glyph(): string {
        return 'H';
    }
}
