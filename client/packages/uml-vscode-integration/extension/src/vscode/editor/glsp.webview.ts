/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { GlspVscodeClient, GlspVscodeConnector } from '@eclipse-glsp/vscode-integration';
import { GLSPIsReadyAction } from 'packages/uml-protocol/lib/index';
import * as vscode from 'vscode';
import { ThemeIntegration } from '../../features/theme/theme-integration.js';
import { getBundleUri, getUri } from '../../utilities/webview.js';
import { WebviewResolver, WebviewResource } from './webview';

export interface GLSPWebviewData {
    readonly diagramType: string;
    readonly client: GlspVscodeClient;
    readonly context: vscode.ExtensionContext;
    readonly themeIntegration: ThemeIntegration;
    readonly connector: GlspVscodeConnector;
}

export class GLSPWebviewResolver implements WebviewResolver {
    constructor(protected readonly data: GLSPWebviewData) {}

    public async resolve(resource: WebviewResource): Promise<void> {
        this.data.client.webviewEndpoint.onActionMessage(m => {
            if (GLSPIsReadyAction.is(m.action)) {
                this.data.themeIntegration.updateTheme(this.data.client);
            }
        });

        const webview = resource.webviewPanel.webview;
        const extensionUri = this.data.context.extensionUri;
        const codiconsCSSUri = getUri(webview, extensionUri, ['css', 'codicon.css']);
        const mainCSSUri = getUri(webview, extensionUri, ['lib', 'main.css']);

        const bundleJSUri = getBundleUri(webview, extensionUri, ['editor', 'bundle.js']);
        const bundleCSSUri = getBundleUri(webview, extensionUri, ['editor', 'bundle.css']);

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
                    <link href="${codiconsCSSUri}" rel="stylesheet" />
                    <link href="${mainCSSUri}" rel="stylesheet" />
                    <link href="${bundleCSSUri}" rel="stylesheet" />
                    </head>
                    <body style="overflow: hidden;">
                        <div id="${this.data.client.clientId}_container" style="height: 100%;"></div>
                        <div id="${this.data.client.clientId}_loading" class="client-loading loading-animation"></div>

                        <script src="${bundleJSUri}"></script>
                    </body>
                </html>`;
    }
}
