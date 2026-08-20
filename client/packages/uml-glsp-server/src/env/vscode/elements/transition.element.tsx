/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { composeBehaviorLabel } from '@borkdominik-biguml/uml-glsp-server';
import { GEdgeElement } from '@borkdominik-biguml/uml-glsp-server/jsx';
import type { Transition } from '@borkdominik-biguml/uml-model-server/grammar';
import type { GEdge } from '@eclipse-glsp/server';
import { EdgeGuardLabel, EdgeNameLabel, pinnedEndpointId } from './core/index.js';
import type { ElementContext } from './core/element-context.js';

export function createTransitionRelation(ctx: ElementContext<Transition>): GEdge {
    // `trigger / effect` on one label and `[guard]` on another, so that each can be retyped on its own -
    // the guard of a transition is the part that is edited most and the part a whole-notation label makes
    // hardest to get at, since it means retyping the rest of the line around it.
    //
    // A transition drawn before it had any of the three carries its label in `name`, so that is what
    // stays on screen until one of them is set.
    const label = composeBehaviorLabel({ trigger: ctx.node.trigger, effect: ctx.node.effect }) ?? ctx.node.name;

    return (
        <GEdgeElement
            id={ctx.node.__id}
            type={ctx.elementType}
            sourceId={pinnedEndpointId(ctx, ctx.node.source!.ref!.__id, ctx.node.source!.ref!, ctx.node.sourcePoint)}
            targetId={pinnedEndpointId(ctx, ctx.node.target!.ref!.__id, ctx.node.target!.ref!, ctx.node.targetPoint)}
            // A transition carries an open arrow head at its target end - the same one the dependency
            // style relations use, which is what the UML notation prescribes for both.
            cssClasses={['uml-edge', 'marker-tent-end']}
        >
            <EdgeNameLabel id={ctx.node.__id} name={label} orientation='horizontal' />
            <EdgeGuardLabel id={ctx.node.__id} guard={ctx.node.guard} named={!!label} orientation='horizontal' />
        </GEdgeElement>
    ) as GEdge;
}
