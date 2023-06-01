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
import { getUri } from '../../utilities/webview';

@injectable()
export class PropertyPaletteProvider implements vscode.WebviewViewProvider {
    @inject(TYPES.ExtensionContext)
    protected readonly extension: vscode.ExtensionContext;

    @postConstruct()
    initialize(): void {
        vscode.window.registerWebviewViewProvider('bigUML.panel.property-palette', this);
    }

    resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext<unknown>,
        token: vscode.CancellationToken
    ): void | Thenable<void> {
        const webview = webviewView.webview;
        webview.options = {
            enableScripts: true
        };

        const umlComponentsUri = getUri(webview, this.extension.extensionUri, ['bundles', 'uml-components', 'main.js']);

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
            <biguml-property-palette></biguml-property-palette>
            
            <script>
        
                // Handle the message inside the webview
                window.addEventListener('message', event => {
                    console.log("message", event);
                });
            </script>
            <script type="module" src="${umlComponentsUri}"></script>

        </body>
        </html>`;
    }
}
