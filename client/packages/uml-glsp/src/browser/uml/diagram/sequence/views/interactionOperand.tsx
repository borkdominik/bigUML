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
import { RectangularNodeView, type RenderingContext, svg } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { type VNode } from 'snabbdom';

import { type NamedElement } from '../../../elements/index.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = { createElement: svg };

@injectable()
export class InteractionOperandNodeView extends RectangularNodeView {
    override render(element: NamedElement, context: RenderingContext): VNode {
        const interactionOperandNode: any = (
            <g class-selected={element.selected} class-mouseover={element.hoverFeedback}>
                <line x1={0} y1={0} x2={element.bounds.width} y2={0} />
                {context.renderChildren(element)}
            </g>
        );

        return interactionOperandNode;
    }
}
