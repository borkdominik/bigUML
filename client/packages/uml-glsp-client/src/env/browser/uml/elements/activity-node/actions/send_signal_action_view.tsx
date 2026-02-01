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
import { RectangularNodeView, type RenderingContext, svg } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { type VNode } from 'snabbdom';
import { type NamedElement } from '../../index.js';

@injectable()
export class SendSignalActionView extends RectangularNodeView {
    override render(element: NamedElement, context: RenderingContext): VNode | undefined {
        if (!this.isVisible(element, context)) {
            return undefined;
        }

        const notchWidth = element.bounds.height / 2;

        const points = [
            { x: 0, y: 0 },
            { x: element.bounds.width - notchWidth, y: 0 },
            { x: element.bounds.width, y: element.bounds.height / 2 }, // middle thing
            { x: element.bounds.width - notchWidth, y: element.bounds.height },
            { x: 0, y: element.bounds.height }
        ];

        return (
            <g class-selected={element.selected} class-mouseover={element.hoverFeedback}>
                <polygon points={points.map(p => `${p.x},${p.y}`).join(' ')}></polygon>

                {context.renderChildren(element)}
            </g>
        ) as any;
    }
}
