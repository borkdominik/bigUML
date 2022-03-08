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
import {injectable} from "inversify";
import { VNode } from "snabbdom";
import {
    RectangularNodeView,
    RenderingContext,
    svg
} from "sprotty/lib";
import { LabeledNode } from "../../model";

/* eslint-disable react/react-in-jsx-scope */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = { createElement: svg };

@injectable()
export class ActorNodeView extends RectangularNodeView {
    render(node: LabeledNode, context: RenderingContext): VNode {
        const actorNode: any = ( <g>
            <defs>
                <filter id="dropShadow">
                    <feDropShadow dx="1.5" dy="1.5" stdDeviation="0.5" style-flood-color="var(--uml-drop-shadow)" style-flood-opacity="0.5" />
                </filter>
            </defs>
            <path d="m 91.166271,19.719835 a 13.195118,13.068849 0 1 1 -26.390236,0 13.195118,13.068849 0 1 1 26.390236,0 z" />
            <path d="m 77.497641,34.903691 0,46.056642 M 77.497641,80.392123 58.052204,96.933371 M 77.529208,80.392123 98.868681,
                95.860084 M 57.073619,47.49903 98.931815,47.46746"/>
            {context.renderChildren(node)}
        </g>);
        return actorNode;
    }
}
