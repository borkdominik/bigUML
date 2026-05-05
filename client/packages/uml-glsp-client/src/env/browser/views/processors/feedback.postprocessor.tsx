/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
/** @jsx svg */
import { type GModelElement, hasArgs, isBoundsAware, isHoverable, isSelectable, type IVNodePostprocessor, svg } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { type VNode } from 'snabbdom';

/**
 * A NodeDecorator to install visual feedback on selected Compartments that hold icons and editable labels
 */
@injectable()
export class CompartmentSelectionFeedback implements IVNodePostprocessor {
    decorate(vnode: VNode, element: GModelElement): VNode {
        if (
            hasArgs(element) &&
            element.args['selection_border'] &&
            isSelectable(element) &&
            element.selected &&
            isBoundsAware(element) &&
            isHoverable(element)
        ) {
            const vPadding = 2;
            const hPadding = 2;

            const feedback: any = (
                <rect
                    x={-hPadding}
                    y={-vPadding}
                    width={element.bounds.width + 2 * hPadding + 2}
                    height={element.bounds.height + 2 * vPadding + 2}
                    class-selection-border={true}
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
