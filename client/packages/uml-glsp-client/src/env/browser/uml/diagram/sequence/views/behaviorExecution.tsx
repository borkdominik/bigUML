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
import { type NamedElement } from '../../../elements/index.js';

@injectable()
export class BehaviorExecutionNodeView extends RectangularNodeView {
    override render(element: NamedElement, context: RenderingContext): VNode {
        const behaviorExecutionNode: any = (
            <g class-node={true} class-selected={element.selected} class-mouseover={element.hoverFeedback}>
                <rect x={0} y={0} rx={2} ry={2} width={Math.max(0, element.bounds.width)} height={Math.max(0, element.bounds.height)} />

                {context.renderChildren(element)}
            </g>
        );

        return behaviorExecutionNode;
    }
}
