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
/** @jsx svg */
import { RectangularNodeView, type RenderingContext, svg } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { type VNode } from 'snabbdom';
import { type LifelineElement } from '../elements/index.js';

@injectable()
export class LifelineNodeView extends RectangularNodeView {
    override render(element: LifelineElement, context: RenderingContext): VNode {
        const lifelineNode: any = (
            <g class-node={true} class-selected={element.selected} class-mouseover={element.hoverFeedback}>
                <line x1={element.bounds.width / 2} y1={0} x2={element.bounds.width / 2} y2={element.bounds.height} />
                <rect
                    x={element.bounds.width / 2 - 10}
                    y={0}
                    rx={0}
                    ry={0}
                    width={20}
                    height={element.bounds.height}
                    class-clickbound={true}
                />
                <rect x={0} y={0} rx={2} ry={2} width={Math.max(0, element.bounds.width)} height={Math.max(0, element.headerHeight())} />
                {context.renderChildren(element)}
            </g>
        );
        return lifelineNode;
    }
}
