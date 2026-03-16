/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { type Hoverable } from '@eclipse-glsp/client';
import { GUmlCompartment } from '../../views/uml-compartment.js';

export class GCompartmentContainer extends GUmlCompartment implements Hoverable {
    static override readonly DEFAULT_FEATURES = [...GUmlCompartment.DEFAULT_FEATURES];

    hoverFeedback = false;
}
