/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { GEdgeElement } from '@borkdominik-biguml/uml-glsp-server/jsx';
import type { Relation } from '@borkdominik-biguml/uml-model-server/grammar';
import type { GEdge } from '@eclipse-glsp/server';
import { EdgeModifiersLabel, EdgeMultiplicityLabel, EdgeNameLabel, EdgeRoleNameLabel, pinnedEndpointId } from './core/index.js';
import type { ElementContext } from './core/element-context.js';

export function createAssociationRelation(ctx: ElementContext<Relation>): GEdge {
    const cssClasses = ['uml-edge'];

    if ((ctx.node as any).sourceAggregation === 'COMPOSITE') {
        cssClasses.push('marker-diamond-start');
    } else if ((ctx.node as any).sourceAggregation === 'SHARED') {
        cssClasses.push('marker-diamond-empty-start');
    }
    if ((ctx.node as any).targetAggregation === 'COMPOSITE') {
        cssClasses.push('marker-diamond-end');
    } else if ((ctx.node as any).targetAggregation === 'SHARED') {
        cssClasses.push('marker-diamond-empty-end');
    }

    return (
        <GEdgeElement
            id={ctx.node.__id}
            type={ctx.elementType}
            // Pinned exactly as a transition is - the branch diamond a class diagram runs an association
            // to is the same shape as the state machine's, offering the same four tips.
            sourceId={pinnedEndpointId(ctx, ctx.node.source!.ref!.__id, ctx.node.source!.ref!, (ctx.node as any).sourcePoint)}
            targetId={pinnedEndpointId(ctx, ctx.node.target!.ref!.__id, ctx.node.target!.ref!, (ctx.node as any).targetPoint)}
            cssClasses={cssClasses}
            // The width of the invisible path the mouse is caught by, drawn over the line (see
            // `GEdgeView.renderMouseHandle`), as on every other relation that carries one. Without it only
            // the 1.5px stroke answers to a click, and a click that misses by a pixel goes through to
            // whatever is behind - the classifier the line runs over.
            args={{ edgePadding: 10 }}
        >
            <EdgeNameLabel id={ctx.node.__id} name={(ctx.node as any).name} />
            <EdgeRoleNameLabel id={ctx.node.__id} end='source' name={(ctx.node as any).sourceName} />
            <EdgeRoleNameLabel id={ctx.node.__id} end='target' name={(ctx.node as any).targetName} />
            <EdgeMultiplicityLabel id={ctx.node.__id} end='source' multiplicity={(ctx.node as any).sourceMultiplicity} />
            <EdgeMultiplicityLabel id={ctx.node.__id} end='target' multiplicity={(ctx.node as any).targetMultiplicity} />
            {/* What either end is qualified by, in braces - `{ordered}`, `{subsets owner}`. */}
            <EdgeModifiersLabel id={ctx.node.__id} end='source' modifiers={(ctx.node as any).sourceModifiers} />
            <EdgeModifiersLabel id={ctx.node.__id} end='target' modifiers={(ctx.node as any).targetModifiers} />
        </GEdgeElement>
    ) as GEdge;
}
