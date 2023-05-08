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
export class CallNodeView extends RectangularNodeView {
    override render(node: LabeledNode, context: RenderingContext): VNode {
        const d = 6;
        const w = Math.max(0, node.bounds.width) + 3 * d;
        const h = Math.max(0, node.bounds.height);

        const callNode: any = (
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

                <rect x={0} y={0} rx={10} ry={10} width={w} height={h} />
                <path d={`M ${w - d} ${h - d} V ${h - 2 * d} H ${w - 3 * d} V ${h - d} M ${w - 2 * d} ${h - d} V ${h - 3 * d}`} />
                {context.renderChildren(node)}
            </g>
        );
        return callNode;
    }
}
