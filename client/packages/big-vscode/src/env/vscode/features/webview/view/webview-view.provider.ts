/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { injectable } from 'inversify';
import type * as vscode from 'vscode';
import type { CancellationToken, WebviewView, WebviewViewResolveContext, window } from 'vscode';
import { BaseWebviewProvider } from '../base/base-webview.provider.js';

type RegisterWebviewViewProviderOptions = Parameters<typeof window.registerWebviewViewProvider>[2];

@injectable()
export class WebviewViewProvider extends BaseWebviewProvider implements vscode.WebviewViewProvider {
    protected webviewView?: WebviewView;

    getWebviewOptions(): RegisterWebviewViewProviderOptions {
        return {
            webviewOptions: {
                retainContextWhenHidden: true
            }
        };
    }

    resolveWebviewView(webviewView: WebviewView, _context: WebviewViewResolveContext<unknown>, _token: CancellationToken): void {
        this.webviewView = webviewView;
        const webview = webviewView.webview;

        webview.options = {
            enableScripts: true,
            localResourceRoots: [this.extensionContext.extensionUri]
        };

        this.resolveMessenger(webviewView);

        webview.html = this.resolveHtml(webview, webviewView);
    }
}
