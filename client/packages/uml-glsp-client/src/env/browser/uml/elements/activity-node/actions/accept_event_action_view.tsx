/********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
/** @jsx svg */
import { type IViewArgs, RectangularNodeView, type RenderingContext, svg } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { type VNode } from 'snabbdom';
import { type NamedElement } from '../../index.js';

/**
 * The shape UML draws for an accept event action: a box with a notch cut into the side the flow comes
 * in on. Kept within the node's own bounds - the notch is cut out of the left edge rather than the
 * whole outline being shifted left of the origin, which drew the shape clear of the node it belongs to
 * and away from the handles and edge anchors that follow the bounds.
 */
@injectable()
export class AcceptEventActionView extends RectangularNodeView {
    override render(element: NamedElement, context: RenderingContext, _args?: IViewArgs): VNode | undefined {
        if (!this.isVisible(element, context)) {
            return undefined;
        }

        const width = Math.max(0, element.bounds.width);
        const height = Math.max(0, element.bounds.height);
        const notchWidth = Math.min(height / 2, width);

        const points = [
            { x: 0, y: 0 },
            { x: width, y: 0 },
            { x: width, y: height },
            { x: 0, y: height },
            { x: notchWidth, y: height / 2 }
        ];

        return (
            <g class-selected={element.selected} class-mouseover={element.hoverFeedback}>
                <polygon points={points.map(p => `${p.x},${p.y}`).join(' ')}></polygon>

                {context.renderChildren(element)}
            </g>
        ) as any;
    }
}
