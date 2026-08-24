/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { GCompartmentView, hoverFeedbackFeature, resizeFeature, selectFeature } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { GUmlCompartment } from '../../../views/uml-compartment.js';

/**
 * The band a region of a composite state is drawn as, and the compartment its parts are written in.
 *
 * Both are compartments the user does something to - a band is dragged to a height of its own - which is
 * why they are model elements of their own rather than the plain compartment every other section is:
 * `selectFeature` is what lets one be picked up at all, and `resizeFeature` is what puts handles on it.
 * The server has the last word on both through its `ShapeTypeHint`s, which `ApplyTypeHintsCommand` grants
 * and takes away per type - these are what a compartment starts with before it is asked.
 *
 * Nothing is drawn here that the plain compartment does not draw: the rules between the bands belong to
 * the state, which is the only element wide enough to run one across (see `renderCompartmentSeparators`),
 * and the band's own children - its `[G1]` label, and the resize handles - are rendered by the view.
 */
export class GStateCompartment extends GUmlCompartment {
    static override readonly DEFAULT_FEATURES = [
        ...GUmlCompartment.DEFAULT_FEATURES,
        // A compartment carries none of these: it is not selectable to begin with, and an element that
        // cannot be selected cannot be given handles either.
        selectFeature,
        hoverFeedbackFeature,
        resizeFeature
    ];
}

@injectable()
export class GStateCompartmentView extends GCompartmentView {}
