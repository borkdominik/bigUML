/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
import {
    Args,
    boundsFeature,
    Deletable,
    deletableFeature,
    fadeFeature,
    Hoverable,
    hoverFeedbackFeature,
    layoutableChildFeature,
    layoutContainerFeature,
    SArgumentable,
    SCompartment,
    Selectable,
    selectFeature,
    SShapeElement
} from '@eclipse-glsp/client';

export class Icon extends SShapeElement {
    iconImageName: string;

    override hasFeature(feature: symbol): boolean {
        return (
            feature === boundsFeature || feature === layoutContainerFeature || feature === layoutableChildFeature || feature === fadeFeature
        );
    }
}

export class IconCSS extends Icon implements SArgumentable {
    args: Args;
}

export class IconLabelCompartment extends SCompartment implements Selectable, Deletable, Hoverable {
    selected = false;
    hoverFeedback = false;

    override hasFeature(feature: symbol): boolean {
        return super.hasFeature(feature) || feature === selectFeature || feature === deletableFeature || feature === hoverFeedbackFeature;
    }
}
