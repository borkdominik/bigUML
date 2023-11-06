/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import {
    alignFeature,
    containerFeature,
    Deletable,
    deletableFeature,
    Hoverable,
    hoverFeedbackFeature,
    popupFeature,
    SCompartment,
    Selectable,
    selectFeature
} from '@eclipse-glsp/client';

export class UmlCompartment extends SCompartment implements Hoverable {
    static override readonly DEFAULT_FEATURES = [
        ...SCompartment.DEFAULT_FEATURES,
        hoverFeedbackFeature,
        popupFeature,
        containerFeature,
        alignFeature
    ];

    hoverFeedback = false;
}

export class InteractableCompartment extends UmlCompartment implements Selectable, Deletable {
    static override readonly DEFAULT_FEATURES = [...UmlCompartment.DEFAULT_FEATURES, deletableFeature, selectFeature];

    selected = false;
}
