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
export class DeepHistoryNodeView extends CircularNodeView {
    override render(node: CircularNode, context: RenderingContext): VNode {
        const radius = this.getRadius(node);

        const deepHistoryNode: any = (
            <g>
                <circle
                    stroke='#4E81B4'
                    class-node={true}
                    class-mouseover={node.hoverFeedback}
                    class-selected={node.selected}
                    r={radius}
                    cx={radius}
                    cy={radius}
                />
                <line
                    x1='0'
                    y1={-(radius / 2)}
                    x2='0'
                    y2={radius / 2}
                    transform={`translate(${radius / 2} ${radius})`}
                    fill='none'
                    stroke='#ffffff'
                    stroke-width='0.125em'
                />
                <line
                    x1='0'
                    y1={-(radius / 2)}
                    x2='0'
                    y2={radius / 2}
                    transform={`translate(${radius / 2 + radius} ${radius})`}
                    fill='none'
                    stroke='#ffffff'
                    stroke-width='0.125em'
                />
                <line
                    x1='0'
                    y1='0'
                    x2={radius}
                    y2='0'
                    transform={`translate(${radius / 2} ${radius})`}
                    fill='none'
                    stroke='#ffffff'
                    stroke-width='0.125em'
                />
                <line
                    x1={-radius / 4}
                    y1={-radius / 4}
                    x2={radius / 4}
                    y2={radius / 4}
                    transform={`translate(${radius} ${radius / 2})`}
                    fill='none'
                    stroke='#ffffff'
                    stroke-width='0.125em'
                />
                <line
                    x1={-radius / 4}
                    y1={radius / 4}
                    x2={radius / 4}
                    y2={-radius / 4}
                    transform={`translate(${radius} ${radius / 2})`}
                    fill='none'
                    stroke='#ffffff'
                    stroke-width='0.125em'
                />
                <line
                    x1={-radius / 4}
                    y1='0'
                    x2={radius / 4}
                    y2='0'
                    transform={`translate(${radius} ${radius / 2})`}
                    fill='none'
                    stroke='#ffffff'
                    stroke-width='0.125em'
                />
                <line
                    x1='0'
                    y1={-radius / 4}
                    x2='0'
                    y2={radius / 4}
                    transform={`translate(${radius} ${radius / 2})`}
                    fill='none'
                    stroke='#ffffff'
                    stroke-width='0.125em'
                />
                {context.renderChildren(node)}
            </g>
        );
        return deepHistoryNode;
    }
}
