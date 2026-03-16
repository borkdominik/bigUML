/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { Container, type interfaces } from 'inversify';
import { TYPES } from '../../../vscode-common.types.js';
import { ActionWebviewMessenger } from '../base/webview-action-messenger.js';
import { WebviewMessenger } from '../base/webview-messenger.js';
import type { WebviewEditorProvider } from './webview-editor.provider.js';

export interface WebviewEditorRegistration {
    provider: interfaces.ServiceIdentifier<WebviewEditorProvider>;
    configure?: (bind: interfaces.Bind) => void;
}

export function bindWebviewEditorFactory(parentBind: interfaces.Bind, registration: WebviewEditorRegistration): void {
    parentBind(TYPES.WebviewEditorFactory).toDynamicValue(context => {
        const childContainer = new Container({ skipBaseClassChecks: true });
        childContainer.parent = context.container as Container;

        const provider = registration.provider;
        childContainer.bind(provider).toSelf().inSingletonScope();
        childContainer.bind(TYPES.WebviewMessenger).to(WebviewMessenger).inSingletonScope();
        childContainer.bind(TYPES.ActionWebviewMessenger).to(ActionWebviewMessenger).inSingletonScope();

        registration.configure?.(childContainer.bind.bind(childContainer));

        return childContainer.get(provider);
    });
}
