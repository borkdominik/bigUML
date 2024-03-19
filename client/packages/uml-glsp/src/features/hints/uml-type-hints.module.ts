/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { ApplyTypeHintsCommand, typeHintsModule } from '@eclipse-glsp/client';
import { FeatureModule, bindOrRebind } from '@eclipse-glsp/protocol';
import { UMLApplyTypeHintsCommand } from './uml-type-hint.provider';

export const umlTypeHintsModule = new FeatureModule(
    (bind, unbind, isBound, rebind) => {
        const context = { bind, unbind, isBound, rebind };
        bindOrRebind(context, ApplyTypeHintsCommand).to(UMLApplyTypeHintsCommand);
    },
    {
        requires: typeHintsModule
    }
);
