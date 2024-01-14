/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import {
    bindOrRebind,
    configureActionHandler, FeatureModule,
    ToolManager, ToolManagerActionHandler
} from '@eclipse-glsp/client';
import { ChangeToolsStateAction, UmlToolManager, UmlToolManagerActionHandler } from './tool-manager';

export const umlToolManagerModule = new FeatureModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };

    bindOrRebind(context, ToolManager).to(UmlToolManager).inSingletonScope();

    bindOrRebind(context, ToolManagerActionHandler).to(UmlToolManagerActionHandler).inSingletonScope();
    configureActionHandler({ bind, isBound }, ChangeToolsStateAction.KIND, UmlToolManagerActionHandler);
});
