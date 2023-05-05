/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { getSubType, RenderingContext, setAttr, SLabelView, svg } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { VNode } from 'snabbdom';

import { SLabelNode } from '../src/graph/model';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = { createElement: svg };

@injectable()
export class LabelNodeView extends SLabelView {
    override render(labelNode: Readonly<SLabelNode>, context: RenderingContext): VNode {
        let image;
        if (labelNode.imageName) {
            image = require('../../../images/' + labelNode.imageName);
        }

        const vnode: any = (
            <g class-selected={labelNode.selected} class-mouseover={labelNode.hoverFeedback} class-sprotty-label-node={true}>
                {!!image && <image class-sprotty-icon={true} href={image} y={-8} width={22} height={15}></image>}
                <text class-sprotty-label={true} x={image ? 30 : 0}>
                    {labelNode.text}
                </text>
            </g>
        );

        const subType = getSubType(labelNode);
        if (subType) {
            setAttr(vnode, 'class', subType);
        }
        return vnode;
    }
}
