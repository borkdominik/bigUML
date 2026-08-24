/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { layoutableChildFeature } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import type { LabelSide } from '../../views/outside-label.js';
import { PinNodeView } from '../../views/pin-node.view.js';
import { NamedElement } from '../named-element/index.js';

/**
 * An input and an output pin are the same square drawn by the same view - which way the flow runs
 * through it is the only difference, and that is the flow's to say, not the pin's.
 *
 * A pin belonging to an action is a child of it, and the action lays its contents out in a column. The
 * layoutable-child feature is dropped so that the column passes the pin over: its place is the position
 * the action's element gave it, on the boundary, and a laid-out pin would be pulled into the stack of
 * labels inside the shape instead.
 */
export class GPinNode extends NamedElement {
    static override readonly DEFAULT_FEATURES = NamedElement.DEFAULT_FEATURES.filter(
        feature => feature !== layoutableChildFeature
    );
}

export class GInputPinNode extends GPinNode {}

/** On the action's left, so its name runs leftwards, away from the shape. */
@injectable()
export class GInputPinNodeView extends PinNodeView {
    protected override get labelSide(): LabelSide {
        return 'above-left';
    }
}

export class GOutputPinNode extends GPinNode {}

/** On the action's right, so its name runs rightwards, away from the shape. */
@injectable()
export class GOutputPinNodeView extends PinNodeView {
    protected override get labelSide(): LabelSide {
        return 'above-right';
    }
}
