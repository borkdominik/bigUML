/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import type { FlowFinalNode } from '@borkdominik-biguml/uml-model-server/grammar';
import type { GModelElement } from '@eclipse-glsp/server';
import { GCircleNodeElement } from './core/circle-node.js';
import type { ElementContext } from './core/element-context.js';

export function createFlowFinalNodeElement(ctx: ElementContext<FlowFinalNode>): GModelElement {
    const position = ctx.modelIndex.findPosition(ctx.node.__id);
    const size = ctx.modelIndex.findSize(ctx.node.__id);
    return (
        <GCircleNodeElement
            id={ctx.node.__id}
            position={position}
            size={size}
            type={ctx.elementType}
        />
    );
}
