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
import { RectangularNodeView, RenderingContext, svg } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { VNode } from 'snabbdom';
import { LifelineElement } from '../elements';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = { createElement: svg };

// Due to typing issues (if we create elements we get an JSX.Element in return, not a VNode) we use a workaround and type the VNode elements with any to avoid compiling problems.
// Please also see for example: https://github.com/eclipse/sprotty/issues/178
// All described possible solutions did not work in our case.

@injectable()
export class LifelineNodeView extends RectangularNodeView {
    override render(element: LifelineElement, context: RenderingContext): VNode {

        // stickman scaling and posiitoning parameters
        const scale = 10;
        const posX = element.bounds.width / 2 - scale;
        const posY = -1;

        const lifelineNode: any = (
            <g class-node={true} class-selected={element.selected} class-mouseover={element.hoverFeedback}>

                <line x1={element.bounds.width / 2} y1={0} x2={element.bounds.width / 2} y2={element.bounds.height} />
                <rect x={element.bounds.width / 2 - 10} y={0} rx={0} ry={0} width={20} height={element.bounds.height}class-clickbound={true}/>
                <rect x={0} y={0} rx={2} ry={2} width={Math.max(0, element.bounds.width)} height={Math.max(0, 38)} />
                {/* stickman */}
                <path d={`M ${posX} ${posY} L ${scale+posX} ${-1 * scale+posY} L ${2*scale+posX} ${posY} M ${1*scale+posX} ${-1*scale+posY} L ${scale+posX} ${-3*scale+posY} A 1 1 0 0 0 ${scale+posX} ${-5*scale+posY} A 1 1 0 0 0 ${scale+posX} ${-3*scale+posY} M ${posX} ${-2*scale+posY} H ${2*scale+posX}`} />

                {context.renderChildren(element)}
            </g>);

        return lifelineNode;
    }
}
