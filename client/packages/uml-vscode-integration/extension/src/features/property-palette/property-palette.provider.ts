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
import { injectable } from 'inversify';
import { getBundleUri, getUri } from '../../utilities/webview';
import { ProviderWebviewContext, UVWebviewProvider } from '../../vscode/webview/webview-provider';

@injectable()
export class PropertyPaletteProvider extends UVWebviewProvider implements IActionHandler {
    static ID = 'bigUML.panel.property-palette';

    get id(): string {
        return PropertyPaletteProvider.ID;
    }

    handle(action: Action): void {
        if (SetPropertyPaletteAction.is(action)) {
            this.postMessage(action);
        }
    }

    protected resolveHTML(providerContext: ProviderWebviewContext): void {
        const webview = providerContext.webviewView.webview;
        const extensionUri = this.extension.extensionUri;

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
}
