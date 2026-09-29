/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
/** @jsx svg */
import { RectangularNodeView, type RenderingContext, svg } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { type VNode } from 'snabbdom';
import { NamedElement } from '../named-element/index.js';

export class GStatePartNode extends NamedElement {}

/**
 * One line of a state's second compartment - `do / print`.
 *
 * Draws its text and nothing behind it: the part is a line written on the state's compartment, not a
 * shape standing on it, and a box of its own would read as a nested node. The separator above the
 * first line belongs to the state, which is the only element wide enough to draw it (see
 * `renderCompartmentSeparators`).
 */
@injectable()
export class GStatePartNodeView extends RectangularNodeView {
    override render(element: GStatePartNode, context: RenderingContext): VNode | undefined {
        if (!this.isVisible(element, context)) {
            return undefined;
        }

        return (
            <g class-selected={element.selected} class-mouseover={element.hoverFeedback}>
                {context.renderChildren(element)}
            </g>
        ) as any;
    }
}
