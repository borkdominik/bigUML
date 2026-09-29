/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { CommonModelTypes } from '@borkdominik-biguml/uml-glsp-server';
import { type GNode } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { RoundedNodeView } from '../../views/rounded-node.view.js';

/** How far the corners of a state holding regions are taken off, matching the activity frame's. */
const FRAME_CORNER_RADIUS = 20;

/**
 * A state is the rounded box, drawn by the view the activity diagram's action shares - the two are the
 * same notation, and keeping one implementation is what stops them drifting apart.
 *
 * A state holding regions is rounded by a flat number instead, the way the activity frame is. A state
 * that size is a frame its substates stand on rather than a box drawn to its own name, and a fifth of
 * its shorter side is a corner tens of pixels deep - deep enough to cut across what is written at the
 * top of the box, which is laid out to the straight edges the padding assumes.
 */
@injectable()
export class StateNodeView extends RoundedNodeView {
    protected override cornerRadius(element: Readonly<GNode>, width: number, height: number): number {
        if (!holdsRegions(element)) {
            return super.cornerRadius(element, width, height);
        }
        return Math.min(FRAME_CORNER_RADIUS, Math.min(width, height) / 2);
    }
}

/** Whether this state is drawn as a frame, which is what having a region band in it makes it. */
function holdsRegions(element: Readonly<GNode>): boolean {
    return element.children.some(child => child.type === CommonModelTypes.COMP_STATE_REGION);
}
