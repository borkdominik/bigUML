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
/* eslint-disable react/jsx-key */
import { injectable } from "inversify";
import { VNode } from "snabbdom";
import {
    DiamondNodeView,
    DiamondNode,
    RenderingContext
} from "sprotty/lib";

@injectable()
export class ChoiceNodeView extends DiamondNodeView {
    render(node: DiamondNode, context: RenderingContext): VNode {
        return super.render(node, context) as VNode;
    }
}
