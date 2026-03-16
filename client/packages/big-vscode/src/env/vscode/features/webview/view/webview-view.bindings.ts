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
import type { BindingContext } from '../../container/container.js';
import { WebviewMessenger } from '../base/index.js';
import { ActionWebviewMessenger } from '../base/webview-action-messenger.js';
import type { WebviewViewProviderOptions } from './webview-view.options.js';
import type { WebviewViewProvider } from './webview-view.provider.js';

export interface WebviewViewRegistration {
    provider: interfaces.ServiceIdentifier<WebviewViewProvider>;
    options: WebviewViewProviderOptions;
    configure?: (bind: interfaces.Bind) => void;
}

export function bindWebviewViewFactory(context: BindingContext, registration: WebviewViewRegistration): void {
    context.bind(TYPES.WebviewViewFactory).toDynamicValue(context => {
        const childContainer = new Container({ skipBaseClassChecks: true });
        childContainer.parent = context.container as Container;

        const provider = registration.provider;
        childContainer.bind(provider).toSelf().inSingletonScope();
        childContainer.bind(TYPES.WebviewViewOptions).toConstantValue(registration.options);
        childContainer.bind(TYPES.WebviewMessenger).to(WebviewMessenger).inSingletonScope();
        childContainer.bind(TYPES.ActionWebviewMessenger).to(ActionWebviewMessenger).inSingletonScope();

        registration.configure?.(childContainer.bind.bind(childContainer));

        return childContainer.get(provider);
    });
}
