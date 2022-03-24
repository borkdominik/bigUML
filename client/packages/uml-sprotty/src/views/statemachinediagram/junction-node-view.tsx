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
import {
    CircularNodeView,
    CircularNode,
    RenderingContext,
    svg
} from "sprotty/lib";

/* eslint-disable react/react-in-jsx-scope */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = { createElement: svg };

@injectable()
export class JunctionNodeView extends CircularNodeView {
    render(node: CircularNode, context: RenderingContext): VNode {
        const radius = this.getRadius(node);
        const junctionNode: any = (<g>
            <circle stroke="#4E81B4" fill="#4E81B4" class-node={true} class-mouseover={node.hoverFeedback}
                class-selected={node.selected}
                r={radius} cx={radius} cy={radius}/>
        </g>);
        return junctionNode;
    }
}
