/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { BIGWebviewProvider, getBundleUri, getUri, type BIGWebviewProviderContext } from './webview.provider.js';

/**
 * A react based webview provider.
 * The provided jsPath needs to have an entry point for a react based component.
 * Use `#root` to register the react component in the bundle.
 */
export abstract class BIGReactWebview extends BIGWebviewProvider {
    protected override retainContextWhenHidden = true;

    protected abstract readonly cssPath: string[];
    protected abstract readonly jsPath: string[];

    protected resolveHTML(providerContext: BIGWebviewProviderContext): void {
        const webview = providerContext.webviewView.webview;
        const extensionUri = this.extensionContext.extensionUri;

        const codiconsCSSUri = getUri(webview, extensionUri, ['webviews', 'assets', 'codicon.css']);
        const cssUri = getBundleUri(webview, extensionUri, this.cssPath);
        const jsUri = getBundleUri(webview, extensionUri, this.jsPath);

        webview.html = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="Content-Security-Policy" 
                content="default-src http://*.fontawesome.com  ${webview.cspSource} data: 'unsafe-inline' 'unsafe-eval';">
            <link id="codicon-css" href="${codiconsCSSUri}" rel="stylesheet" type="text/css" />
            <link id="bundle-css" href="${cssUri}" rel="stylesheet" type="text/css" />
            <title>Property Palette</title>
        </head>
        <body>
            <div id="root"></div>
            <script type="module" src="${jsUri}"></script>
        </body>
        </html>`;
    }
}
