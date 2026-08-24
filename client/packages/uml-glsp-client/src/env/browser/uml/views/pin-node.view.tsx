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
import { type LabelSide, outsideLabel } from './outside-label.js';

/**
 * The square UML draws for a pin: the value an action takes in, or the one it hands on. Shared by the
 * input and the output pin, which are the same notation - the square sits on the action's boundary and
 * the flow runs into it or out of it, and that direction is all that tells the two apart.
 *
 * The square is drawn to the node's own bounds so the selection outline and the point a flow anchors to
 * line up with it. Its name is written above rather than inside: a pin is 16 pixels across, which holds
 * no text at all, and the name belongs outside the action the pin sits on in any case.
 */
@injectable()
export class PinNodeView extends RectangularNodeView {
    /**
     * Which way the name runs. Away from the action by default of the two subclasses below, so the names
     * of an action's input and output pins lean off their own sides instead of meeting over the shape.
     */
    protected get labelSide(): LabelSide {
        return 'above';
    }

    override render(node: Readonly<GNode>, context: RenderingContext): VNode | undefined {
        if (!this.isVisible(node, context)) {
            return undefined;
        }

        const size = { width: Math.max(0, node.bounds.width), height: Math.max(0, node.bounds.height) };

        return (
            <g class-selected={node.selected} class-mouseover={node.hoverFeedback}>
                <rect x={0} y={0} width={size.width} height={size.height} class-uml-node-background />
                {outsideLabel(node, size, this.labelSide)}
                {context.renderChildren(node)}
            </g>
        ) as any;
    }
}
