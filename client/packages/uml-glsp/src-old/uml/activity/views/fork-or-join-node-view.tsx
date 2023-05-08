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

import { ControlNode } from '../model';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = { createElement: svg };

@injectable()
export class ForkOrJoinNodeView extends RectangularNodeView {
    override render(node: ControlNode, context: RenderingContext): VNode {
        const graph: any = (
            <g>
                <rect
                    class-sprotty-node={true}
                    class-forkOrJoin={true}
                    class-mouseover={node.hoverFeedback}
                    class-selected={node.selected}
                    fill='#205C99'
                    width={10}
                    height={Math.max(50, node.bounds.height)}
                ></rect>
                {context.renderChildren(node)}
            </g>
        );
        return graph;
    }
}
