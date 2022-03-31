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
import {injectable} from "inversify";
import {VNode} from "snabbdom";
import {IVNodePostprocessor, SModelElement, svg} from "sprotty";

import {IconLabelCompartment} from "./model";

/* eslint-disable react/react-in-jsx-scope */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = {
    createElement: svg
};

/**
 * A NodeDecorator to install visual feedback on selected NodeLabels
 */

/* @injectable()
export class LabelSelectionFeedback implements IVNodePostprocessor {
    decorate(vnode: VNode, element: SModelElement): VNode {
        if (element instanceof SLabelNode && element.selected) {
            const vPadding = 1;
            const hPadding = 5;

            const feedback: any = (
                <rect
                    x={-hPadding}
                    y={-element.bounds.height / 2 - vPadding}
                    width={element.bounds.width + 2 * hPadding}
                    height={element.bounds.height + 2 * vPadding}
                    class-selection-feedback={true}
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
} */

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
