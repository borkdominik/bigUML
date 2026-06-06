/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { CommonModelTypes } from '@borkdominik-biguml/uml-glsp-server';
import { GEdgeElement, GLabelElement } from '@borkdominik-biguml/uml-glsp-server/jsx';
import type { Relation } from '@borkdominik-biguml/uml-model-server/grammar';
import type { GEdge } from '@eclipse-glsp/server';
import type { ElementContext } from './core/element-context.js';

export function createPackageImportRelation(ctx: ElementContext<Relation>): GEdge {
    return (
        <GEdgeElement
            id={ctx.node.__id}
            type={ctx.elementType}
            sourceId={ctx.node.source!.ref!.__id}
            targetId={ctx.node.target!.ref!.__id}
            cssClasses={['uml-edge', 'uml-edge-dashed', 'marker-tent-end']}
        >
            <GLabelElement type={CommonModelTypes.LABEL_TEXT} text='<<import>>' />
        </GEdgeElement>
    ) as GEdge;
}
