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
    RenderingContext,
    SLabelView,
    setAttr,
    getSubType,
    svg
} from "sprotty/lib";
import {SLabelNode} from "../../model";

/* eslint-disable react/react-in-jsx-scope */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = { createElement: svg };

@injectable()
export class TransitionEffectView extends SLabelView {
    render(labelNode: Readonly<SLabelNode>, context: RenderingContext): VNode {

        const vnode: any = (
            <g
                class-selected={labelNode.selected}
                class-mouseover={labelNode.hoverFeedback}
                class-sprotty-label-node={true}
            >
                <text id="effectType" fill="#000000">
                    <tspan x={0}> / Activity: </tspan>
                </text>
                <text class-sprotty-label={true} x={85} y={-4}>{labelNode.text}</text>
            </g>
        );

        const subType = getSubType(labelNode);
        if (subType) {
            setAttr(vnode, "class", subType);
        }
        return vnode;
    }
}
