/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { Uri, type ExtensionContext, type Webview } from 'vscode';

export interface WebviewHtmlProvider {
    createHtml(extensionContext: ExtensionContext, webview: Webview): string;
}

export interface WebviewHtmlProviderOptions {
    rootProvider?: (webview: Webview) => string;
    files: {
        js: string[][];
        css: string[][];
    };
}

export class ReactHtmlProvider implements WebviewHtmlProvider {
    constructor(protected readonly options: WebviewHtmlProviderOptions) {}

    createHtml(extensionContext: ExtensionContext, webview: Webview): string {
        const extensionUri = extensionContext.extensionUri;
        const { js, css } = this.options.files;

        const codiconsCSSUri = getUri(webview, extensionUri, ['webviews', 'assets', 'codicon.css']);
        const mainCSSUri = getUri(webview, extensionUri, ['build', 'index.css']);

        const cssLinks = css
            .map(path => {
                const uri = getBundleUri(webview, extensionUri, path);
                return `<link href="${uri}" rel="stylesheet" type="text/css" />`;
            })
            .join('\n            ');

        const jsScripts = js
            .map(path => {
                const uri = getBundleUri(webview, extensionUri, path);
                return `<script type="module" src="${uri}"></script>`;
            })
            .join('\n            ');

        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="Content-Security-Policy" 
                content="default-src http://*.fontawesome.com  ${webview.cspSource} data: 'unsafe-inline' 'unsafe-eval';">
            <link id="vscode-codicon-stylesheet" href="${codiconsCSSUri}" rel="stylesheet" type="text/css" />
            <link href="${mainCSSUri}" rel="stylesheet" type="text/css" />
            ${cssLinks}
            <title>Webview</title>
        </head>
        <body>
            ${this.createRootElement(webview)}
            ${jsScripts}
        </body>
        </html>`;
    }

    protected createRootElement(webview: Webview): string {
        return this.options.rootProvider ? this.options.rootProvider(webview) : `<div id="root"></div>`;
    }
}

function getUri(webview: Webview, extensionUri: Uri, pathList: string[]): Uri {
    return webview.asWebviewUri(Uri.joinPath(extensionUri, ...pathList));
}

function getBundleUri(webview: Webview, extensionUri: Uri, pathList: string[]): Uri {
    return getUri(webview, extensionUri, ['webviews', ...pathList]);
}
