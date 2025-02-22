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
import { type DiamondNode, DiamondNodeView, type RenderingContext, svg } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { type VNode } from 'snabbdom';

@injectable()
export class DecisionMergeNodeView extends DiamondNodeView {
    override render(node: DiamondNode, context: RenderingContext): VNode {
        const height = Math.max(node.size.height, 0);
        const width = Math.max(node.size.width, 0);
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        const decisionNode: any = (
            <g>
                <polygon
                    class-node={true}
                    class-selected={node.selected}
                    class-mouseover={node.hoverFeedback}
                    stroke='#276cb2'
                    fill='#276cb2'
                    strokeWidth={2}
                    points={`${halfWidth},${0} ${width},${halfHeight} ${halfWidth},${height} ${0},${halfHeight}`}
                ></polygon>
                {context.renderChildren(node)}
            </g>
        );
        return decisionNode;
    }
}
