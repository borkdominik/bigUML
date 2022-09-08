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
import { SLabel } from "@eclipse-glsp/client";
import { injectable } from "inversify";
import { VNode } from "snabbdom";
import { RectangularNodeView, RenderingContext, svg } from "sprotty/lib";

import { LabeledNode } from "../../../model";

/* eslint-disable react/react-in-jsx-scope */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = {createElement: svg};

@injectable()
export class EnumerationNodeView extends RectangularNodeView {
    render(node: LabeledNode, context: RenderingContext): VNode {
        if (node.children[0].children[0] instanceof SLabel) {
            const enumTypeLabel = node.children[0].children[0] as SLabel;
            const enumText = enumTypeLabel.text;
            enumTypeLabel.text = enumText.replace("<<", "«").replace(">>", "»");
        }
        const enumNode: any = (
            <g class-node={true} class-selected={node.selected} class-mouseover={node.hoverFeedback}>
                <defs>
                    <filter id="dropShadow">
                        <feDropShadow dx="1.5" dy="1.5" stdDeviation="0.5" style-flood-color="var(--uml-drop-shadow)"
                            style-flood-opacity="0.5"/>
                    </filter>
                </defs>

                <rect x={0} y={0} rx={2} ry={2} width={Math.max(0, node.bounds.width)}
                    height={Math.max(0, node.bounds.height)}/>
                {context.renderChildren(node)}
            </g>);
        return enumNode;
    }
}
