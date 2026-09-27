/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { edgeCenterId } from '@borkdominik-biguml/uml-glsp-server';
import { type Action, GEdge, type GModelElement } from '@eclipse-glsp/client';
import { EdgeCreationToolMouseListener } from '@eclipse-glsp/client/lib/features/tools/edge-creation/edge-creation-tool.js';
import { GEdgeCenterPort } from '../../../uml/views/edge-center-port.js';

/**
 * Lets a new edge be drawn to anywhere on an existing edge, and attaches it at that edge's centre.
 *
 * An edge is not something an edge can end on - only its centre dot is (see `GEdgeCenterPort`) - and the
 * dot is a few pixels across, so aiming for it would mean hitting it exactly. Pointing at any part of an
 * edge counts as pointing at its dot instead, which is where the new edge is attached anyway.
 */
export class UmlEdgeCreationToolMouseListener extends EdgeCreationToolMouseListener {
    override mouseOver(target: GModelElement, event: MouseEvent): Action[] {
        return super.mouseOver(edgeCenterFor(target), event);
    }
}

/** The centre dot of the edge `target` is part of, or `target` itself where it is not on an edge. */
export function edgeCenterFor(target: GModelElement): GModelElement {
    if (target instanceof GEdgeCenterPort) {
        return target;
    }
    let element: GModelElement | undefined = target;
    while (element && !(element instanceof GEdge)) {
        element = 'parent' in element ? (element.parent as GModelElement | undefined) : undefined;
    }
    const center = element ? element.root.index.getById(edgeCenterId(element.id)) : undefined;
    return center instanceof GEdgeCenterPort ? center : target;
}
