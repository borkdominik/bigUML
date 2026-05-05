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
export class InitialNodeView extends CircularNodeView {
    override render(node: CircularNode, context: RenderingContext): VNode {
        const radius = this.getRadius(node);
        const intitalNode: any = (
            <g>
                <circle
                    stroke='#4E81B4'
                    fill='#4E81B4'
                    class-node={true}
                    class-mouseover={node.hoverFeedback}
                    class-selected={node.selected}
                    r={radius}
                    cx={radius}
                    cy={radius}
                ></circle>
                {context.renderChildren(node)}
            </g>
        );
        return intitalNode;
    }
}
