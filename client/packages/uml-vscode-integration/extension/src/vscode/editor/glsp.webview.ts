/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { GlspVscodeConnector } from '@eclipse-glsp/vscode-integration';
import * as vscode from 'vscode';
import { ThemeIntegration } from '../../features/theme/theme-integration';
import { getUri } from '../../utilities/webview';
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
        const glspUri = getUri(webview, extensionUri, ['bundles', 'uml-glsp', 'main.js']);
        const codiconsUri = getUri(webview, extensionUri, ['node_modules', '@vscode/codicons', 'dist', 'codicon.css']);
        const mainCSSUri = getUri(webview, extensionUri, ['lib', 'main.css']);

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
                        <div id="${this.data.clientId}_container" style="height: 100%;"></div>
                        <div id="${this.data.clientId}_loading" class="client-loading loading-animation"></div>

                        <script src="${glspUri}"></script>
                    </body>
                </html>`;
    }
}
