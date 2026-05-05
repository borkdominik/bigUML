/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { DisposableCollection, type Disposable } from '@eclipse-glsp/vscode-integration';
import { injectable, multiInject, optional, postConstruct } from 'inversify';
import * as vscode from 'vscode';
import { TYPES } from '../../../vscode-common.types.js';
import type { WebviewViewProvider } from './webview-view.provider.js';

@injectable()
export class WebviewViewManager implements Disposable {
    protected readonly toDispose = new DisposableCollection();

    @multiInject(TYPES.WebviewViewFactory)
    @optional()
    protected readonly providers: WebviewViewProvider[] = [];

    dispose(): void {
        this.toDispose.dispose();
    }

    @postConstruct()
    initialize(): void {
        this.registerAll();
    }

    registerAll(): void {
        for (const provider of this.providers) {
            this.register(provider);
        }
    }

    protected register(provider: WebviewViewProvider): void {
        const disposable = vscode.window.registerWebviewViewProvider(provider.viewType, provider, provider.getWebviewOptions());

        this.toDispose.push(disposable, provider);
    }
}
