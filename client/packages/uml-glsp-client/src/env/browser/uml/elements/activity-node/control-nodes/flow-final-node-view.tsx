/********************************************************************************
 * Copyright (c) 2021 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
/** @jsx svg */
import { type CircularNode, CircularNodeView, type RenderingContext, svg } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { type VNode } from 'snabbdom';

@injectable()
export class FlowFinalNodeView extends CircularNodeView {
    override render(node: CircularNode, context: RenderingContext): VNode {
        const radius = this.getRadius(node);
        const radiusRt = radius / Math.sqrt(2);
        const flowFinalNode: any = (
            <g>
                <ellipse
                    fill='#4E81B4'
                    cx={radius}
                    cy={radius}
                    rx={radius}
                    ry={radius}
                    class-node={true}
                    class-mouseover={node.hoverFeedback}
                    class-selected={node.selected}
                ></ellipse>
                <line
                    fill='#276cb2'
                    y2={radius - radiusRt}
                    x2={radius - radiusRt}
                    y1={radius + radiusRt}
                    x1={radius + radiusRt}
                    strokeWidth={radius / 2}
                />
                <line
                    fill='#276cb2'
                    y2={radius + radiusRt}
                    x2={radius - radiusRt}
                    y1={radius - radiusRt}
                    x1={radius + radiusRt}
                    strokeWidth={radius / 2}
                />
                {context.renderChildren(node)}
            </g>
        );
        return flowFinalNode;
    }
}
