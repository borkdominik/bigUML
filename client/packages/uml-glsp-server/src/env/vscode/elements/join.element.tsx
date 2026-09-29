/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import type { Join } from '@borkdominik-biguml/uml-model-server/grammar';
import type { GModelElement } from '@eclipse-glsp/server';
import type { ElementContext } from './core/element-context.js';
import { GForkJoinNodeElement } from './core/fork-join-node.js';

export function createJoinElement(ctx: ElementContext<Join>): GModelElement {
    const position = ctx.modelIndex.findPosition(ctx.node.__id);
    const size = ctx.modelIndex.findSize(ctx.node.__id);
    return (
        <GForkJoinNodeElement
            id={ctx.node.__id}
            name={ctx.node.name}
            position={position}
            size={size}
            type={ctx.elementType}
            // Same as the fork: a join is the same bar, joined by the same transitions.
            connectionPoints
        />
    );
}
