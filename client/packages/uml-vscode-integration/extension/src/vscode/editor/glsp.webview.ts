/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

import { GlspVscodeConnector } from '@eclipse-glsp/vscode-integration';
import * as vscode from 'vscode';
import { ThemeIntegration } from '../../features/theme/theme-integration';
import { WebviewResolver, WebviewResource } from './webview';

export interface GLSPWebviewData {
    readonly diagramType: string;
    readonly clientId: string;
    readonly clientReady: Promise<void>;
    readonly context: vscode.ExtensionContext;
    readonly themeIntegration: ThemeIntegration;
    readonly connector: GlspVscodeConnector;
}

export class GLSPWebviewResolver implements WebviewResolver {
    constructor(protected readonly data: GLSPWebviewData) {}

    public async resolve(resource: WebviewResource): Promise<void> {
        this.data.clientReady.then(() => this.data.themeIntegration.updateTheme(this.data.clientId));

        const webview = resource.webviewPanel.webview;
        const extensionUri = this.data.context.extensionUri;
        const webviewScriptSourceUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'webview', 'webview.js'));
        const codiconsUri = webview.asWebviewUri(
            vscode.Uri.joinPath(extensionUri, 'node_modules', '@vscode/codicons', 'dist', 'codicon.css')
        );
        const mainCSSUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'lib', 'main.css'));

        webview.options = {
            enableScripts: true
        };

        webview.html = `
                <!DOCTYPE html>
                <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, height=device-height">
                        <meta http-equiv="Content-Security-Policy" content="
                    default-src http://*.fontawesome.com  ${webview.cspSource} data: 'unsafe-inline' 'unsafe-eval';
                    ">
                    <link href="${codiconsUri}" rel="stylesheet" />
                    <link href="${mainCSSUri}" rel="stylesheet" />
                    </head>
                    <body style="overflow: hidden;">
                        <div id="${this.data.clientId}_container" style="height: 100%;">
                            <div id="${this.data.clientId}_loading" class="client-loading"></div>
                        </div>
                        <script src="${webviewScriptSourceUri}"></script>
                    </body>
                </html>`;
    }
}
