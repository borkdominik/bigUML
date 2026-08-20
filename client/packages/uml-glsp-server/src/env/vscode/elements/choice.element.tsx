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
            // The four tips, offered on either diagram a choice is drawn on. Both of the edges that run
            // to one there can record which tip it was put on - a transition in `sourcePoint`/
            // `targetPoint`, and an association in fields of its own added to match. An edge that
            // cannot hold a pin is not refused the shape, it just meets it unpinned; see
            // `GenericCreateEdgeOperationHandler`.
            connectionPoints
        />
    );
}
