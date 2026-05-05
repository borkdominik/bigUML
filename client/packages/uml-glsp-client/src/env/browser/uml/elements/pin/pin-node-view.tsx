/********************************************************************************
 * Copyright (c) 2021 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
/** @jsx svg */
import { type GChildElement, RectangularNodeView, type RenderingContext, ShapeView, svg } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { type VNode } from 'snabbdom';
import { type GLabeledNode } from '../../views/uml-label.view.js';

@injectable()
export class PinPortView extends ShapeView {
    render(model: GChildElement, _context: RenderingContext): VNode {
        const pin = model.parent as GLabeledNode;
        const w = pin.bounds.width;
        const h = pin.bounds.height;
        const pinPort: any = (
            <g class-node={true}>
                <rect transform='(5, 0)' x={w - 10} y={(h - 10) / 2} width={10} height={10} />
            </g>
        );
        return pinPort;
    }
}

@injectable()
export class PinNodeView extends RectangularNodeView {
    override render(node: GLabeledNode, context: RenderingContext): VNode {
        // const w = node.bounds.width;
        const pinNode: any = (
            <g
                class-node={true}
                // transform={`(${w * (-1) - 10}, -16)`}
                class-selected={node.selected}
                class-mouseover={node.hoverFeedback}
            >
                <defs>
                    <filter id='dropShadow'>
                        <feDropShadow
                            dx='1.5'
                            dy='1.5'
                            stdDeviation='0.5'
                            style-flood-color='var(--uml-drop-shadow)'
                            style-flood-opacity='0.5'
                        />
                    </filter>
                </defs>
                {context.renderChildren(node)}
            </g>
        );
        return pinNode;
    }
}
