/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { DiamondNode, DiamondNodeView, RenderingContext } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { VNode } from 'snabbdom';

@injectable()
export class ChoiceNodeView extends DiamondNodeView {
    override render(node: DiamondNode, context: RenderingContext): VNode {
        return super.render(node, context) as VNode;
    }
}
