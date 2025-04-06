/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { configureActionHandler, FeatureModule } from '@eclipse-glsp/client';
import { ExtensionActionKind } from '@eclipse-glsp/vscode-integration-webview/lib/features/default/extension-action-handler.js';
import { RevisionManagementResponse, RequestRevisionManagementAction } from '../common/revision-management.action.js';
import { RevisionManagementHandler } from './revision-management.handler.js';

export const revisionManagementMmodule = new FeatureModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };
    // Register the HelloWorldHandler to handle the RequestHelloWorldAction
    bind(RevisionManagementHandler).toSelf().inSingletonScope();
    configureActionHandler(context, RequestRevisionManagementAction.KIND, RevisionManagementHandler);

    // Allow the HelloWorldActionResponse to propagate to the server
    bind(ExtensionActionKind).toConstantValue(RevisionManagementResponse.KIND);
});
