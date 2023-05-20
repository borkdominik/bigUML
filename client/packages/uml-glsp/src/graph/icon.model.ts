/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import {
    Args,
    boundsFeature,
    fadeFeature,
    layoutableChildFeature,
    layoutContainerFeature,
    SArgumentable,
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
