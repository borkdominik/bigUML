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
/* eslint-disable react/jsx-key */
import { injectable } from "inversify";
import { VNode } from "snabbdom";
import { RenderingContext, ShapeView, svg } from "sprotty/lib";

import { LabeledNode } from "../../model";

/* eslint-disable react/react-in-jsx-scope */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = { createElement: svg };

@injectable()
export class AcceptEventNodeView extends ShapeView {
    render(node: LabeledNode, context: RenderingContext): VNode {
        const acceptEventNode: any =(<g>
            <path d={`M -32 0 H ${node.bounds.width} V ${node.bounds.height} H -32 L 0 ${node.bounds.height / 2} L -32 0`} />
            {context.renderChildren(node)}
        </g>);
        return acceptEventNode;
    }
}

@injectable()
export class AcceptTimeEventNodeView extends ShapeView {
    render(node: LabeledNode, context: RenderingContext): VNode {
        const d = `M ${node.bounds.width / 2 - 8} 4 H ${node.bounds.width / 2 + 8} L`
            + `${node.bounds.width / 2 - 8} -20 H ${node.bounds.width / 2 + 8} L ${node.bounds.width / 2 - 8} 4`;
        const acceptTimeEventNode: any = (<g>
            <path d={d} />
            {context.renderChildren(node)}
        </g>);
        return acceptTimeEventNode;
    }
}
