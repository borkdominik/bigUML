/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import type { DecisionNode } from '@borkdominik-biguml/uml-model-server/grammar';
import type { GModelElement } from '@eclipse-glsp/server';
import { GDiamondNodeElement } from './core/diamond-node.js';
import type { ElementContext } from './core/element-context.js';

export function createDecisionNodeElement(ctx: ElementContext<DecisionNode>): GModelElement {
    const position = ctx.modelIndex.findPosition(ctx.node.__id);
    const size = ctx.modelIndex.findSize(ctx.node.__id);
    return (
        <GDiamondNodeElement
            id={ctx.node.__id}
            name={ctx.node.name}
            position={position}
            size={size}
            type={ctx.elementType}
            // The same four tips the state machine's choice offers. A control flow can record which one
            // it was pinned to, the way a transition does - see `ControlFlow.sourcePoint`.
            connectionPoints
        />
    );
}
