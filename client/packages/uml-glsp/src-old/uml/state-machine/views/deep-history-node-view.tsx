/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
import { CircularNode, IView, RenderingContext, svg } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { VNode } from 'snabbdom';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = { createElement: svg };

@injectable()
export class DeepHistoryNodeView implements IView {
    render(node: CircularNode, context: RenderingContext): VNode {
        const imageSrc = require('../../../images/DeepHistory.svg') as string;
        const deepHistoryNode: any = (
            <g>
                <image class-sprotty-icon={true} href={imageSrc} x={-2} y={-1} width={node.size.width} height={node.size.height} />
            </g>
        );
        return deepHistoryNode;
    }
}
