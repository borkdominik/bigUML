/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import {
    Deletable,
    deletableFeature,
    Hoverable,
    hoverFeedbackFeature,
    SCompartment,
    Selectable,
    selectFeature
} from '@eclipse-glsp/client';

export class InteractableCompartment extends SCompartment implements Selectable, Deletable, Hoverable {
    static override readonly DEFAULT_FEATURES = [...SCompartment.DEFAULT_FEATURES, deletableFeature, selectFeature, hoverFeedbackFeature];

    selected = false;
    hoverFeedback = false;
}
