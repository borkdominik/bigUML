/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import type { Choice } from '@borkdominik-biguml/uml-model-server/grammar';
import type { GModelElement } from '@eclipse-glsp/server';
import { GDiamondNodeElement } from './core/diamond-node.js';
import type { ElementContext } from './core/element-context.js';

export function createChoiceElement(ctx: ElementContext<Choice>): GModelElement {
    const position = ctx.modelIndex.findPosition(ctx.node.__id);
    const size = ctx.modelIndex.findSize(ctx.node.__id);
    return (
        <GDiamondNodeElement
            id={ctx.node.__id}
            name={ctx.node.name}
            position={position}
            size={size}
            type={ctx.elementType}
            // A choice is the one diamond whose edges can be pinned: a transition has somewhere to
            // record which tip it was put on, where the activity diagram's control flows do not.
            connectionPoints
        />
    );
}
