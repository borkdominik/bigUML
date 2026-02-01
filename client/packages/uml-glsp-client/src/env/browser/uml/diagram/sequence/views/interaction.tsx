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
import { DefaultTypes, GCompartment, RectangularNodeView, type RenderingContext, svg } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { type VNode } from 'snabbdom';

import { type InteractionElement } from '../elements/interacton.model.js';

@injectable()
export class InteractionNodeView extends RectangularNodeView {
    override render(element: InteractionElement, context: RenderingContext): VNode {
        const header = element.children.find(c => c instanceof GCompartment && c.type === DefaultTypes.COMPARTMENT_HEADER) as GCompartment;

        const interactionNode: any = (
            <g class-selected={element.selected} class-mouseover={element.hoverFeedback}>
                <rect x={0} y={0} rx={0} ry={0} width={Math.max(0, element.bounds.width)} height={Math.max(0, element.bounds.height)} />

                <path d={`M 0 0 H ${header.size.width} V ${38} L ${header.size.width - 10} ${38 + 10} H 0 V 0`} />

                {context.renderChildren(element)}
            </g>
        );

        return interactionNode;
    }
}
