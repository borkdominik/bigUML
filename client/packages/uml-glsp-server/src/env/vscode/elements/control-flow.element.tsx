/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { GEdgeElement } from '@borkdominik-biguml/uml-glsp-server/jsx';
import type { ControlFlow } from '@borkdominik-biguml/uml-model-server/grammar';
import type { GEdge } from '@eclipse-glsp/server';
import { EdgeGuardLabel, EdgeNameLabel, pinnedEndpointId } from './core/index.js';
import type { ElementContext } from './core/element-context.js';

export function createControlFlowRelation(ctx: ElementContext<ControlFlow>): GEdge {
    return (
        <GEdgeElement
            id={ctx.node.__id}
            type={ctx.elementType}
            // Pinned exactly as a transition is - the fork and join a control flow runs between are the
            // same bar as the state machine's, and offer the same two points to pin to.
            sourceId={pinnedEndpointId(ctx, ctx.node.source!.ref!.__id, ctx.node.source!.ref!, ctx.node.sourcePoint)}
            targetId={pinnedEndpointId(ctx, ctx.node.target!.ref!.__id, ctx.node.target!.ref!, ctx.node.targetPoint)}
            // An activity edge carries an open arrow head at its target end, the same one the state
            // machine draws on a transition.
            cssClasses={['uml-edge', 'marker-tent-end']}
        >
            <EdgeNameLabel id={ctx.node.__id} name={ctx.node.name} />
            {/* The condition the flow is taken under, which is as much a part of what the edge says as
                its name - and on the flows out of a decision node it is the whole of it. */}
            <EdgeGuardLabel id={ctx.node.__id} guard={ctx.node.guard} named={!!ctx.node.name} />
        </GEdgeElement>
    ) as GEdge;
}
