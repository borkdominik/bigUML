/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { CircularNodeView, RenderingContext, svg } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { VNode } from 'snabbdom';

import { LabeledNode } from '../../../model';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = { createElement: svg };

@injectable()
export class FinalStateNodeView extends CircularNodeView {
    override render(node: LabeledNode, context: RenderingContext): VNode {
        const radius = this.getRadius(node);

        const finalStateNode: any = (
            <g class-node={true} class-selected={node.selected} class-mouseover={node.hoverFeedback}>
                <circle r={radius} cx={radius} cy={radius} />
                <circle fill='#4E81B4' r={radius / 2} cx={radius} cy={radius} />
            </g>
        );
        return finalStateNode;
    }
}
