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
            sourceId={ctx.node.source!.ref!.__id}
            targetId={ctx.node.target!.ref!.__id}
            cssClasses={cssClasses}
        />
    ) as GEdge;
}
