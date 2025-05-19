/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { FeatureModule } from '@eclipse-glsp/client';
import { ExtensionActionKind } from '@eclipse-glsp/vscode-integration-webview/lib/features/default/extension-action-handler.js';
import { AdvancedSearchActionResponse } from '../common/advancedsearch.action.js';
//import { AdvancedSearchHandler } from './advancedsearch.handler.js';

export const advancedSearchModule = new FeatureModule(bind => {
    //const context = { bind, unbind, isBound, rebind };
    // Register the AdvancedSearchHandler to handle the RequestAdvancedSearchAction
    //bind(AdvancedSearchHandler).toSelf().inSingletonScope();
    //configureActionHandler(context, RequestAdvancedSearchAction.KIND, AdvancedSearchHandler);

    // Allow the AdvancedSearchActionResponse to propagate to the server
    bind(ExtensionActionKind).toConstantValue(AdvancedSearchActionResponse.KIND);
});
