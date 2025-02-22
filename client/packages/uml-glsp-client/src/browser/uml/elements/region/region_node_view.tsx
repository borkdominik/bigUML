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
import { DefaultTypes, GCompartment, RectangularNodeView, type RenderingContext, svg } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { type VNode } from 'snabbdom';
import { type GLabeledNode } from '../../views/uml-label.view.js';

@injectable()
export class RegionNodeView extends RectangularNodeView {
    override render(node: GLabeledNode, context: RenderingContext): VNode | undefined {
        if (!this.isVisible(node, context)) {
            return undefined;
        }

        const compartment = node.children.find(
            c => c instanceof GCompartment && c.type !== DefaultTypes.COMPARTMENT_HEADER && c.children.length > 0
        ) as GCompartment | undefined;

        const regionNode: any = (
            <g class-node={true} class-selected={node.selected} class-mouseover={node.hoverFeedback}>
                <rect x={0} y={0} width={Math.max(0, node.bounds.width)} height={Math.max(0, node.bounds.height)} />

                {compartment && (
                    <path
                        class-uml-comp-separator
                        d={`M 0,${compartment.position.y}  L ${node.bounds.width},${compartment.position.y}`}
                    ></path>
                )}

                {context.renderChildren(node)}
            </g>
        );
        return regionNode;
    }
}
