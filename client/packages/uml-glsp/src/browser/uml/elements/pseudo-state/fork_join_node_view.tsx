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
import { RectangularNode, RectangularNodeView, RenderingContext, svg } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { VNode } from 'snabbdom';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = { createElement: svg };

@injectable()
export class ForkJoinNodeView extends RectangularNodeView {
    override render(node: RectangularNode, context: RenderingContext): VNode {
        const _node: any = (
            <g>
                <rect
                    class-node={true}
                    class-fork={true}
                    class-mouseover={node.hoverFeedback}
                    class-selected={node.selected}
                    fill='#276cb2'
                    width={10}
                    height={Math.max(80, node.bounds.height)}
                    rx={5}
                    ry={5}
                ></rect>
                {context.renderChildren(node)}
            </g>
        );
        return _node;
    }
}
