/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { GEdgeElement } from '@borkdominik-biguml/uml-glsp-server/jsx';
import type { InformationFlow } from '@borkdominik-biguml/uml-model-server/grammar';
import type { GEdge } from '@eclipse-glsp/server';
import { EdgeNameLabel, EdgeStereotypeLabel } from './core/index.js';
import type { ElementContext } from './core/element-context.js';

/**
 * An information flow is drawn as a dependency is - a dashed line with an open arrow head at the
 * target - carrying the name of what is conveyed above the line and the `flow` stereotype below it.
 */
export function createInformationFlowRelation(ctx: ElementContext<InformationFlow>): GEdge {
    return (
        <GEdgeElement
            id={ctx.node.__id}
            type={ctx.elementType}
            sourceId={ctx.node.source!.ref!.__id}
            targetId={ctx.node.target!.ref!.__id}
            cssClasses={['uml-edge', 'uml-edge-dashed', 'marker-tent-end']}
            args={{ edgePadding: 10 }}
        >
            <EdgeStereotypeLabel id={ctx.node.__id} stereotype='flow' />
            <EdgeNameLabel id={ctx.node.__id} name={ctx.node.name} />
        </GEdgeElement>
    ) as GEdge;
}
