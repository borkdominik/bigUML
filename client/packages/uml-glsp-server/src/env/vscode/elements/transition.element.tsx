/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { GEdgeElement } from '@borkdominik-biguml/uml-glsp-server/jsx';
import type { Transition } from '@borkdominik-biguml/uml-model-server/grammar';
import type { GEdge } from '@eclipse-glsp/server';
import { composeTransitionLabel, EdgeNameLabel, pinnedEndpointId } from './core/index.js';
import type { ElementContext } from './core/element-context.js';

export function createTransitionRelation(ctx: ElementContext<Transition>): GEdge {
    // A transition drawn before it had a trigger, guard and effect of its own carries its label in
    // `name`, so that is what stays on screen until one of the three is set.
    const label = composeTransitionLabel(ctx.node) ?? ctx.node.name;

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
        </GEdgeElement>
    ) as GEdge;
}
