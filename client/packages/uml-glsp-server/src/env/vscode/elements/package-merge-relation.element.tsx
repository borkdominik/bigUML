/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { leadsMergeGroup } from '@borkdominik-biguml/uml-glsp-server';
import { GEdgeElement } from '@borkdominik-biguml/uml-glsp-server/jsx';
import type { Relation } from '@borkdominik-biguml/uml-model-server/grammar';
import type { GEdge } from '@eclipse-glsp/server';
import { EdgeStereotypeLabel } from './core/index.js';
import type { ElementContext } from './core/element-context.js';

export function createPackageMergeRelation(ctx: ElementContext<Relation>): GEdge {
    // The merges into one package are drawn as branches off a single connector rather than as a line
    // each - that is the client's doing, see the note on `UmlPolylineEdgeRouter` on why nothing here
    // says so - and a connector carries one `<<merge>>` between them rather than one apiece. It goes
    // on whichever merge the model lists first. The arrow head the connector ends in is left to the
    // client too: which merge ends it is a question of how the set was drawn, which only the router
    // that drew it can answer - see `GPackageMergeEdgeView`.
    const leads = leadsMergeGroup(ctx.node);

    return (
        <GEdgeElement
            id={ctx.node.__id}
            type={ctx.elementType}
            sourceId={ctx.node.source!.ref!.__id}
            targetId={ctx.node.target!.ref!.__id}
            cssClasses={['uml-edge', 'uml-edge-dashed']}
            // A connector is aimed at as well as read: it is where a further package is added to the
            // set, and a merge is dropped on it by a click that lands on the line. The padding is what
            // makes that line whole rather than what makes it broad - a dashed stroke catches on its
            // dashes alone, so without it a click that plainly hit the line would be turned away for
            // having fallen in a gap. Held to the width the stroke itself reaches when it is pointed
            // at, so that the line is what has to be hit and there is no band around it standing in.
            args={{ edgePadding: 1.5 }}
        >
            {/* Written at the middle of this merge's route, which falls on the shared line for a set
                standing off the package it merges into - the line runs midway between the two, so the
                branch this merge turns off is the shorter part of its way in. A package set much
                further back than the rest of its set would carry the label onto its own branch
                instead; the merge listed first keeps it either way, so that adding another merge does
                not move it. */}
            {leads && <EdgeStereotypeLabel id={ctx.node.__id} stereotype='merge' />}
        </GEdgeElement>
    ) as GEdge;
}
