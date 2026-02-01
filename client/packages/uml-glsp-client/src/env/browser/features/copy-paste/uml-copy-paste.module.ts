/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { bindAsService, bindOrRebind, FeatureModule, TYPES } from '@eclipse-glsp/client';
import { copyPasteModule } from '@eclipse-glsp/client/lib/features/copy-paste/copy-paste-modules.js';
import { LastContainableElementTracker, UMLServerCopyPasteHandler } from './copy-paste.js';

export const umlCopyPasteModule = new FeatureModule(
    (bind, unbind, isBound, rebind) => {
        const context = { bind, unbind, isBound, rebind };
        bindOrRebind(context, TYPES.ICopyPasteHandler).to(UMLServerCopyPasteHandler);
        bindAsService(context, TYPES.MouseListener, LastContainableElementTracker);
    },
    {
        requires: copyPasteModule
    }
);
