/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { TYPES } from '@eclipse-glsp/client';
import { copyPasteModule } from '@eclipse-glsp/client/lib/features/copy-paste/copy-paste-modules';
import { bindAsService, bindOrRebind, FeatureModule } from '@eclipse-glsp/protocol';
import { LastContainableElementTracker, UmlServerCopyPasteHandler } from './copy-paste';

export const umlCopyPasteModule = new FeatureModule(
    (bind, unbind, isBound, rebind) => {
        const context = { bind, unbind, isBound, rebind };
        bindOrRebind(context, TYPES.ICopyPasteHandler).to(UmlServerCopyPasteHandler);
        bindAsService(context, TYPES.MouseListener, LastContainableElementTracker);
    },
    {
        requires: copyPasteModule
    }
);
