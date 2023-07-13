/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
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
import { alignFeature, layoutableChildFeature, RenderingContext, ShapeView, SNode, svg } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { VNode } from 'snabbdom';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = { createElement: svg };

export class ActorNode extends SNode {
    static override readonly DEFAULT_FEATURES = [...SNode.DEFAULT_FEATURES, alignFeature, layoutableChildFeature];
}

@injectable()
export class ActorView extends ShapeView {
    override render(element: ActorNode, context: RenderingContext): VNode | undefined {
        if (!this.isVisible(element, context)) {
            return undefined;
        }

        return (
            <g class-selected={element.selected} class-mouseover={element.hoverFeedback}>
                <rect x={0} y={0} rx={2} ry={2}
                    width={Math.max(0, element.bounds.width)}
                    height={Math.max(0, element.bounds.height)}
                    visibility='hidden'
                />
                {context.renderChildren(element)}
            </g>
        ) as any;
    }
}
