/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { GEdgeElement } from '@borkdominik-biguml/uml-glsp-server/jsx';
import type { Extend } from '@borkdominik-biguml/uml-model-server/grammar';
import type { GEdge } from '@eclipse-glsp/server';
import type { ElementContext } from './core/element-context.js';

export function createExtendRelation(ctx: ElementContext<Extend>): GEdge {
    return (
        <GEdgeElement
            id={ctx.node.__id}
            type={ctx.elementType}
            sourceId={ctx.node.source!.ref!.__id}
            targetId={ctx.node.target!.ref!.__id}
            cssClasses={['uml-edge']}
        />
    ) as GEdge;
}
