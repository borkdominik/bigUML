/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { GEdgeElement } from '@borkdominik-biguml/uml-glsp-server/jsx';
import type { EdgeLineStyle, EdgeMarker, GenericEdge } from '@borkdominik-biguml/uml-model-server/grammar';
import type { GEdge } from '@eclipse-glsp/server';
import type { ElementContext } from './core/element-context.js';
import { EdgeMultiplicityLabel, EdgeNameLabel, pinnedEndpointId } from './core/index.js';

/** The marker class each end marker is drawn with (see `marker.css`); `NONE` draws nothing. */
const MARKER_CLASS: Record<EdgeMarker, string | undefined> = {
    NONE: undefined,
    OPEN_ARROW: 'marker-tent',
    TRIANGLE: 'marker-triangle-empty',
    FILLED_TRIANGLE: 'marker-triangle',
    DIAMOND: 'marker-diamond-empty',
    FILLED_DIAMOND: 'marker-diamond',
    CROSS: 'marker-cross'
};

const LINE_CLASS: Record<EdgeLineStyle, string | undefined> = {
    SOLID: undefined,
    DASHED: 'uml-edge-dashed',
    DOTTED: 'uml-edge-dotted'
};

/**
 * A generic edge: drawn entirely from how the user set it up - its two ends and its line - rather than
 * from what it means, which is nothing beyond what its name says.
 */
export function createGenericEdgeRelation(ctx: ElementContext<GenericEdge>): GEdge {
    const edge = ctx.node;
    const sourceMarker = MARKER_CLASS[edge.sourceMarker ?? 'NONE'];
    const targetMarker = MARKER_CLASS[edge.targetMarker ?? 'NONE'];
    const lineClass = LINE_CLASS[edge.lineStyle ?? 'SOLID'];
    const cssClasses = [
        'uml-edge',
        ...(lineClass ? [lineClass] : []),
        ...(sourceMarker ? [`${sourceMarker}-start`] : []),
        ...(targetMarker ? [`${targetMarker}-end`] : [])
    ];

    return (
        <GEdgeElement
            id={edge.__id}
            type={ctx.elementType}
            sourceId={pinnedEndpointId(ctx, edge.source!.ref!.__id, edge.source!.ref!, edge.sourcePoint)}
            targetId={pinnedEndpointId(ctx, edge.target!.ref!.__id, edge.target!.ref!, edge.targetPoint)}
            cssClasses={cssClasses}
            args={{ edgePadding: 10 }}
        >
            <EdgeNameLabel id={edge.__id} name={edge.name} />
            <EdgeMultiplicityLabel id={edge.__id} end='source' multiplicity={edge.sourceMultiplicity} />
            <EdgeMultiplicityLabel id={edge.__id} end='target' multiplicity={edge.targetMultiplicity} />
        </GEdgeElement>
    ) as GEdge;
}
