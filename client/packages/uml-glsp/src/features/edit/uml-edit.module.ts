/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { EditLabelUI } from '@eclipse-glsp/client';
import { bindOrRebind, FeatureModule } from '@eclipse-glsp/protocol';
import { EditLabelUIAutocomplete } from './edit-label.autocomplete';

export const umlEditModule = new FeatureModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };
    bindOrRebind(context, EditLabelUI).to(EditLabelUIAutocomplete);
});
