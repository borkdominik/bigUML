/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { SetPropertyPaletteAction } from '@borkdominik-biguml/uml-common';
import { Action, IActionHandler } from '@eclipse-glsp/client';
import { inject, injectable, postConstruct } from 'inversify';
import * as vscode from 'vscode';
import { TYPES } from '../../di.types';
import { getBundleUri, getUri } from '../../utilities/webview';

export interface ResolvedWebview {
    webviewView: vscode.WebviewView;
    context: vscode.WebviewViewResolveContext<unknown>;
    token: vscode.CancellationToken;
}

@injectable()
export class PropertyPaletteProvider implements vscode.WebviewViewProvider, IActionHandler {
    protected resolvedWebview?: ResolvedWebview;

    @inject(TYPES.ExtensionContext)
    protected readonly extension: vscode.ExtensionContext;

    @postConstruct()
    initialize(): void {
        vscode.window.registerWebviewViewProvider('bigUML.panel.property-palette', this);

        vscode.commands.registerCommand('bigUML.test', () => {
            console.log('TEST');
        });
    }

    handle(action: Action): void {
        if (SetPropertyPaletteAction.is(action)) {
            this.postMessage(action);
        }
    }

    resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext<unknown>,
        token: vscode.CancellationToken
    ): void | Thenable<void> {
        const extensionUri = this.extension.extensionUri;
        const webview = webviewView.webview;

        this.resolvedWebview = {
            webviewView,
            context,
            token
        };

        webview.onDidReceiveMessage((message: any) => {
            console.log('EXTENSION Got message', message);
        });

        webview.options = {
            enableScripts: true
        };

        const codiconsCSSUri = getUri(webview, extensionUri, ['node_modules', '@vscode/codicons', 'dist', 'codicon.css']);
        const bundleCSSUri = getBundleUri(webview, extensionUri, ['property-palette', 'bundle.css']);
        const bundleJSUri = getBundleUri(webview, extensionUri, ['property-palette', 'bundle.js']);

        webview.html = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="Content-Security-Policy" 
                content="default-src http://*.fontawesome.com  ${webview.cspSource} data: 'unsafe-inline' 'unsafe-eval';">
            <link id="codicon-css" href="${codiconsCSSUri}" rel="stylesheet" />
            <link id="bundle-css" href="${bundleCSSUri}" rel="stylesheet" />
            <title>Property Palette</title>
        </head>
        <body>
            <biguml-property-palette-standalone></biguml-property-palette-standalone>
            <script type="module" src="${bundleJSUri}"></script>
        </body>
        </html>`;
    }

    protected postMessage(message: any): void {
        if (this.resolvedWebview === undefined) {
            console.warn('webview is not ready to post message');
            return;
        }

        this.resolvedWebview.webviewView.webview.postMessage(message);
    }
}
