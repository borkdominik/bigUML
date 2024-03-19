/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { GCompartment } from '@eclipse-glsp/client';
// eslint-disable-next-line no-restricted-imports
import { alignFeature } from 'sprotty';

export class GUMLCompartment extends GCompartment {
    static override readonly DEFAULT_FEATURES = [...GCompartment.DEFAULT_FEATURES, alignFeature];
}
