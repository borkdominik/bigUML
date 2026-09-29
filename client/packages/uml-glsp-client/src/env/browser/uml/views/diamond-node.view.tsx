/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
/** @jsxRuntime classic */
/** @jsx svg */
import { type GNode, RectangularNodeView, type RenderingContext, svg } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { type VNode } from 'snabbdom';
import { hitStrokePolygon } from './hit-area.js';
import { placeOutsideLabels } from './outside-label.js';

/**
 * The diamond UML draws for a branch point - a choice pseudostate on a state machine, a decision or
 * merge node on an activity diagram. One view for all of them, since the notation is the same.
 *
 * The diamond fills the node's bounds, so the resize handles and the points edges anchor to line up
 * with the shape. Its name is written under it: the diamond is small by convention, and a name laid
 * out inside one spills out through the sloped sides long before it fills the box.
 */
@injectable()
export class DiamondNodeView extends RectangularNodeView {
    override render(node: Readonly<GNode>, context: RenderingContext): VNode | undefined {
        if (!this.isVisible(node, context)) {
            return undefined;
        }

        const size = { width: Math.max(0, node.bounds.width), height: Math.max(0, node.bounds.height) };
        const { width, height } = size;
        const points = `${width / 2},0 ${width},${height / 2} ${width / 2},${height} 0,${height / 2}`;
        // The name is a label child of the node, written under the shape.
        placeOutsideLabels(node as GNode, size, 'below');

        return (
            <g class-selected={node.selected} class-mouseover={node.hoverFeedback}>
                {/* Slack along the sloped sides, where a diamond narrows to a point and a click lands
                    beside it rather than on it. */}
                {hitStrokePolygon(points)}
                <polygon points={points} class-uml-node-background />
                {context.renderChildren(node)}
            </g>
        ) as any;
    }
}
