/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { bindOrRebind, DelKeyDeleteTool, EditLabelUI, FeatureModule } from '@eclipse-glsp/client';
import { EditLabelUIAutocomplete } from './edit-label.autocomplete.js';
import { UmlDelKeyDeleteTool } from './uml-delete-tool.js';

export const umlEditModule = new FeatureModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };
    bindOrRebind(context, EditLabelUI).to(EditLabelUIAutocomplete);
    // The stock tool is bound as a service to itself, so rebinding the class is what puts the backspace
    // listener in front of the `Delete`-only one - see `UmlDelKeyDeleteTool`.
    bindOrRebind(context, DelKeyDeleteTool).to(UmlDelKeyDeleteTool);
});
