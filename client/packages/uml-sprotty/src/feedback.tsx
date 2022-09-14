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
import { IVNodePostprocessor, SModelElement, svg } from "sprotty";

import { IconLabelCompartment } from "./model";

/* eslint-disable react/react-in-jsx-scope */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = { createElement: svg };

// Due to typing issues (if we create elements we get an JSX.Element in return, not a VNode) we use a workaround and type the VNode elements with any to avoid compiling problems.
// Please also see for example: https://github.com/eclipse/sprotty/issues/178
// All described possible solutions did not work in our case.

/**
 * A NodeDecorator to install visual feedback on selected Compartments that hold icons and editable labels
 */
@injectable()
export class IconLabelCompartmentSelectionFeedback implements IVNodePostprocessor {
    decorate(vnode: VNode, element: SModelElement): VNode {
        if (element instanceof IconLabelCompartment && (element.hoverFeedback || element.selected)) {
            const vPadding = -1;
            const hPadding = 3;

            const feedback: any = (
                <rect
                    x={-hPadding}
                    y={-vPadding}
                    width={element.bounds.width + hPadding}
                    height={element.bounds.height + vPadding}
                    class-selection-feedback={true}
                    class-hover={element.hoverFeedback}
                    class-selected={element.selected}
                />
            );
            if (!vnode.children) {
                vnode.children = [];
            }
            vnode.children.push(feedback);
        }
        return vnode;
    }

    postUpdate(): void {
        // nothing to do
    }
}
