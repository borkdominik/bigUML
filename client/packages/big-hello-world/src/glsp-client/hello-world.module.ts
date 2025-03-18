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
import { HelloWorldActionResponse, RequestHelloWorldAction } from '../common/hello-world.action.js';
import { HelloWorldHandler } from './hello-world.handler.js';

export const helloWorldModule = new FeatureModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };
    // Register the HelloWorldHandler to handle the RequestHelloWorldAction
    bind(HelloWorldHandler).toSelf().inSingletonScope();
    configureActionHandler(context, RequestHelloWorldAction.KIND, HelloWorldHandler);

    // Allow the HelloWorldActionResponse to propagate to the server
    bind(ExtensionActionKind).toConstantValue(HelloWorldActionResponse.KIND);
});
