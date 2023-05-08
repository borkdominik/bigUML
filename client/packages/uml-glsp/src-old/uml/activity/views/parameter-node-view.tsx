/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { RectangularNodeView, RenderingContext, svg } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { VNode } from 'snabbdom';

import { LabeledNode } from '../../../model';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = { createElement: svg };

@injectable()
export class ParameterNodeView extends RectangularNodeView {
    override render(node: LabeledNode, context: RenderingContext): VNode {
        const parameterNode: any = (
            <g class-node={true} class-selected={node.selected} class-mouseover={node.hoverFeedback}>
                <defs>
                    <filter id='dropShadow'>
                        <feDropShadow
                            dx='1.5'
                            dy='1.5'
                            stdDeviation='0.5'
                            style-flood-color='var(--uml-drop-shadow)'
                            style-flood-opacity='0.5'
                        />
                    </filter>
                </defs>

                <rect x={0} y={0} width={24} height={24} />
                {context.renderChildren(node)}
            </g>
        );
        return parameterNode;
    }
}
