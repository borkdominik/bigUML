/********************************************************************************
 * Copyright (c) 2021-2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
import { injectable } from "inversify";
import { VNode } from "snabbdom";
import { IView, RectangularNodeView, RenderingContext, svg } from "sprotty/lib";

import { Icon, LabeledNode } from "./model";

/* eslint-disable react/react-in-jsx-scope */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = { createElement: svg };

// Due to typing issues (if we create elements we get an JSX.Element in return, not a VNode) we use a workaround and type the VNode elements with any to avoid compiling problems.
// Please also see for example: https://github.com/eclipse/sprotty/issues/178
// All described possible solutions did not work in our case.

@injectable()
export class ClassNodeView extends RectangularNodeView {
    render(node: LabeledNode, context: RenderingContext): VNode {
        const rhombStr = "M 0,38  L " + node.bounds.width + ",38";

        const classNode: any = (
            <g class-node={true} class-selected={node.selected} class-mouseover={node.hoverFeedback}>
                <defs>
                    <filter id="dropShadow">
                        <feDropShadow dx="1.5" dy="1.5" stdDeviation="0.5" style-flood-color="var(--uml-drop-shadow)" style-flood-opacity="0.5" />
                    </filter>
                </defs>

                <rect x={0} y={0} rx={2} ry={2} width={Math.max(0, node.bounds.width)} height={Math.max(0, node.bounds.height)} />
                {context.renderChildren(node)}
                {(node.children[1] && node.children[1].children.length > 0) ?
                    <path class-uml-comp-separator={true} d={rhombStr}></path> : ""}
            </g>);
        return classNode;
    }
}

@injectable()
export class IconView implements IView {
    render(element: Icon, context: RenderingContext): VNode {
        let image;
        if (element.iconImageName) {
            image = require("../images/" + element.iconImageName);
        }

        const iconView: any = (
            <g>
                <image class-sprotty-icon={true} href={image} x={-2} y={-1} width={20} height={20}></image>
                {context.renderChildren(element)}
            </g>);
        return iconView;
    }
}
