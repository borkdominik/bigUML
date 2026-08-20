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
import { hitAreaBox } from './hit-area.js';
import { outsideLabel } from './outside-label.js';

/**
 * A fork or join, drawn the way UML draws both: one solid bar across the flow.
 *
 * Shared by the state machine pseudostates and the activity control nodes, which are the same
 * notation on two diagrams. The bar is drawn to the node's own bounds rather than to a fixed size,
 * because everything else about the node - the selection outline, the resize handles, and the points
 * incoming and outgoing edges anchor to - is derived from those bounds by sprotty. A bar painted at
 * some other size would simply be in the wrong place relative to all of them.
 *
 * Which way it runs is settled before it gets here: `GForkJoinNodeElement` hands over bounds that are
 * long on the axis the element's `orientation` names, so a turned bar arrives already turned.
 */
@injectable()
export class ForkJoinNodeView extends RectangularNodeView {
    override render(node: Readonly<GNode>, context: RenderingContext): VNode | undefined {
        if (!this.isVisible(node, context)) {
            return undefined;
        }

        const size = { width: Math.max(0, node.bounds.width), height: Math.max(0, node.bounds.height) };
        // A vertical bar keeps its name above it; a horizontal one would collide with the flow there.
        const side = size.width >= size.height ? 'left' : 'above';
        // Rounded off to half the bar's thickness, which is as round as a rectangle goes: the ends are
        // semicircles and the long faces stay straight, so the bar still reads as one rule across the
        // flow. Taken from the thickness rather than fixed, so a bar stood on end rounds the same as one
        // lying flat, and a resized bar keeps its shape.
        const radius = Math.min(size.width, size.height) / 2;

        return (
            <g class-selected={node.selected} class-mouseover={node.hoverFeedback}>
                {/* A bar is ten pixels thick and the rest of it is length, so the slack goes around the
                    whole of it rather than along its outline. */}
                {hitAreaBox(size.width, size.height, radius)}
                <rect x={0} y={0} width={size.width} height={size.height} rx={radius} ry={radius} class-uml-fork-join-bar />
                {outsideLabel(node, size, side)}
                {context.renderChildren(node)}
            </g>
        ) as any;
    }
}
