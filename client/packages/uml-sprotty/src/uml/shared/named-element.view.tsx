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
import { SCompartment } from "@eclipse-glsp/client";
import { DefaultTypes } from "@eclipse-glsp/protocol";
import { injectable } from "inversify";
import { VNode } from "snabbdom";
import { RectangularNodeView, RenderingContext, svg } from "sprotty/lib";

import { NamedElement } from "./named-element.model";

/* eslint-disable react/react-in-jsx-scope */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = { createElement: svg };

// Due to typing issues (if we create elements we get an JSX.Element in return, not a VNode) we use a workaround and type the VNode elements with any to avoid compiling problems.
// Please also see for example: https://github.com/eclipse/sprotty/issues/178
// All described possible solutions did not work in our case.

@injectable()
export class NamedElementView extends RectangularNodeView {
    render(
        element: NamedElement,
        context: RenderingContext
    ): VNode | undefined {
        if (!this.isVisible(element, context)) {
            return undefined;
        }

        const compartment = element.children.find(
            c =>
                c instanceof SCompartment &&
                c.type !== DefaultTypes.COMPARTMENT_HEADER &&
                c.children.length > 0
        ) as SCompartment | undefined;

        return (
            <g
                class-selected={element.selected}
                class-mouseover={element.hoverFeedback}
            >
                <rect
                    x={0}
                    y={0}
                    rx={2}
                    ry={2}
                    width={Math.max(0, element.bounds.width)}
                    height={Math.max(0, element.bounds.height)}
                />

                {compartment && (
                    <path
                        class-uml-comp-separator
                        d={`M 0,${compartment.position.y}  L ${element.bounds.width},${compartment.position.y}`}
                    ></path>
                )}

                {context.renderChildren(element)}
            </g>
        ) as any;
    }
}
