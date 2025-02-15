/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { bindOrRebind, configureActionHandler, FeatureModule, ToolManagerActionHandler, TYPES } from '@eclipse-glsp/client';
import { ChangeToolsStateAction, UMLToolManager, UMLToolManagerActionHandler } from './uml-tool-manager.js';

export const umlToolManagerModule = new FeatureModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };

    bindOrRebind(context, TYPES.IToolManager).to(UMLToolManager).inSingletonScope();
    bindOrRebind(context, ToolManagerActionHandler).to(UMLToolManagerActionHandler).inSingletonScope();

    configureActionHandler({ bind, isBound }, ChangeToolsStateAction.KIND, UMLToolManagerActionHandler);
});
