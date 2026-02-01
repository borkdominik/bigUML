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
import { CircularNodeView, type RenderingContext, svg } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { type VNode } from 'snabbdom';
import { type GLabeledNode } from '../../../views/uml-label.view.js';

@injectable()
export class ActivityFinalNodeView extends CircularNodeView {
    override render(node: GLabeledNode, _context: RenderingContext): VNode {
        const radius = this.getRadius(node);

        const activityFinalNode: any = (
            <g class-node={true} class-selected={node.selected} class-mouseover={node.hoverFeedback}>
                <circle r={radius} cx={radius} cy={radius} />
                <circle fill='#4E81B4' r={radius / 1.5} cx={radius} cy={radius} />
            </g>
        );
        return activityFinalNode;
    }
}
