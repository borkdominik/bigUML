/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import {
    Connectable,
    connectableFeature,
    deletableFeature,
    EditableLabel,
    editFeature,
    editLabelFeature,
    fadeFeature,
    hoverFeedbackFeature,
    SEdge,
    selectFeature,
    SLabel,
    SRoutableElement
} from '@eclipse-glsp/client';

export class ConnectableEditableLabel extends SLabel implements EditableLabel, Connectable {
    constructor() {
        super();
        ConnectableEditableLabel.DEFAULT_FEATURES.push(connectableFeature);
    }

    canConnect(routable: SRoutableElement, role: 'source' | 'target'): boolean {
        return true;
        // TODO: If neccessary return false under some conditions
    }

    override hasFeature(feature: symbol): boolean {
        return feature === editLabelFeature || super.hasFeature(feature);
    }
}

export class ConnectableEdge extends SEdge implements Connectable {
    canConnect(routable: SRoutableElement, role: 'source' | 'target'): boolean {
        return true;
        // TODO: If neccessary return false under some conditions
    }

    static override readonly DEFAULT_FEATURES = [
        editFeature,
        deletableFeature,
        selectFeature,
        fadeFeature,
        hoverFeedbackFeature,
        connectableFeature
    ];

    override selected = false;
    override hoverFeedback = true;
    override opacity = 1;
}
