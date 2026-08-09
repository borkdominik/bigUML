/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { injectable } from 'inversify';
import { RoundedNodeView } from '../../views/rounded-node.view.js';
import { NamedElement } from '../named-element/index.js';

export class GActivityNode extends NamedElement {}

/** How far the corners of the activity frame are taken off. */
const FRAME_CORNER_RADIUS = 20;

/**
 * An activity is the rounded boundary its flow is drawn inside, with its name written along the top.
 *
 * The corners are rounded by a flat number rather than by a proportion of the shape. A proportion is
 * right for a box drawn to the size of its own name, but a frame is hundreds of pixels across, and a
 * fifth of that is a corner so round the shape stops reading as a rectangle at all.
 */
@injectable()
export class GActivityNodeView extends RoundedNodeView {
    protected override cornerRadius(width: number, height: number): number {
        return Math.min(FRAME_CORNER_RADIUS, Math.min(width, height) / 2);
    }
}
