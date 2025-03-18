/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { ApplyTypeHintsCommand, FeatureModule, bindOrRebind, typeHintsModule } from '@eclipse-glsp/client';
import { UMLApplyTypeHintsCommand } from './uml-type-hint.provider.js';

export const umlTypeHintsModule = new FeatureModule(
    (bind, unbind, isBound, rebind) => {
        const context = { bind, unbind, isBound, rebind };
        bindOrRebind(context, ApplyTypeHintsCommand).to(UMLApplyTypeHintsCommand);
    },
    {
        requires: typeHintsModule
    }
);
