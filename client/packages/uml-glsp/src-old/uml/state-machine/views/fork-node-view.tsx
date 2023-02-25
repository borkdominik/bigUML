/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
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
export class ForkNodeView extends RectangularNodeView {
    override render(node: RectangularNode, context: RenderingContext): VNode {
        const forkNode: any = (
            <g class-node={true} class-selected={node.selected} class-mouseover={node.hoverFeedback}>
                <rect
                    x={0}
                    y={0}
                    rx={0}
                    ry={0}
                    fill='#4E81B4'
                    width={Math.max(0, node.bounds.width)}
                    height={Math.max(0, node.bounds.height)}
                />
            </g>
        );
        return forkNode;
    }
}
