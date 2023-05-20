/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { CircularNode, CircularNodeView, RenderingContext, svg } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { VNode } from 'snabbdom';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = { createElement: svg };

@injectable()
export class FlowFinalNodeView extends CircularNodeView {
    override render(node: CircularNode, context: RenderingContext): VNode {
        const radius = this.getRadius(node);
        const radiusRt = radius / Math.sqrt(2);
        const flowFinalNode: any = (
            <g>
                <ellipse
                    fill='#276cb2'
                    stroke='#4E81B4'
                    cx={radius}
                    cy={radius}
                    rx={radius}
                    ry={radius}
                    class-node={true}
                    class-mouseover={node.hoverFeedback}
                    class-selected={node.selected}
                ></ellipse>
                <line
                    stroke='#000000'
                    y2={radius - radiusRt}
                    x2={radius - radiusRt}
                    y1={radius + radiusRt}
                    x1={radius + radiusRt}
                    strokeWidth={radius / 2}
                    fill='#000000'
                />
                <line
                    stroke='#000000'
                    y2={radius + radiusRt}
                    x2={radius - radiusRt}
                    y1={radius - radiusRt}
                    x1={radius + radiusRt}
                    strokeWidth={radius / 2}
                    fill='#000000'
                />
                {context.renderChildren(node)}
            </g>
        );
        return flowFinalNode;
    }
}
