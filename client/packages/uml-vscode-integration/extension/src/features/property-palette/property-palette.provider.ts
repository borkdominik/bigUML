/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { inject, injectable, postConstruct } from 'inversify';
import * as vscode from 'vscode';
import { TYPES } from '../../di.types';
import { getBundleUri } from '../../utilities/webview';

export interface ResolvedWebview {
    webviewView: vscode.WebviewView;
    context: vscode.WebviewViewResolveContext<unknown>;
    token: vscode.CancellationToken;
}

@injectable()
export class PropertyPaletteProvider implements vscode.WebviewViewProvider {
    protected resolvedWebview?: ResolvedWebview;

    @inject(TYPES.ExtensionContext)
    protected readonly extension: vscode.ExtensionContext;

    @postConstruct()
    initialize(): void {
        let counter = 0;
        vscode.window.registerWebviewViewProvider('bigUML.panel.property-palette', this);

        vscode.commands.registerCommand('bigUML.test', () => {
            this.resolvedWebview?.webviewView.webview.postMessage({
                type: 'notification',
                text: `Counter ${counter++}`
            });
        });
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

        const bundleJSUri = getBundleUri(webview, extensionUri, ['property-palette', 'bundle.js']);

        webview.html = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="Content-Security-Policy" 
                content="default-src http://*.fontawesome.com  ${webview.cspSource} data: 'unsafe-inline' 'unsafe-eval';">
            <title>Property Palette</title>
        </head>
        <body>
            Hello World
            <biguml-property-palette id="property-palette"></biguml-property-palette>
            <script type="module">
                import { initializeConnection } from "${bundleJSUri}";

                initializeConnection();
            </script>
        </body>
        </html>`;
    }
}
