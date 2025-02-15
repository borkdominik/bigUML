/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { InitializeCanvasBoundsAction } from '@borkdominik-biguml/uml-glsp';
import { MinimapExportSvgAction, RequestMinimapExportSvgAction } from '@borkdominik-biguml/uml-protocol';
import { SetModelAction, SetViewportAction, UpdateModelAction } from '@eclipse-glsp/protocol';
import { injectable, postConstruct } from 'inversify';
import { VSCodeSettings } from '../../language.js';
import { getBundleUri, getUri } from '../../utilities/webview.js';
import { ProviderWebviewContext, UMLWebviewProvider } from '../../vscode/webview/webview-provider.js';

@injectable()
export class MinimapProvider extends UMLWebviewProvider {
    get id(): string {
        return VSCodeSettings.minimap.viewId;
    }

    protected override retainContextWhenHidden = true;

    @postConstruct()
    protected override init(): void {
        super.init();

        this.extensionHostConnection.cacheActions([InitializeCanvasBoundsAction.KIND, SetViewportAction.KIND, MinimapExportSvgAction.KIND]);
    }

    protected resolveHTML(providerContext: ProviderWebviewContext): void {
        const webview = providerContext.webviewView.webview;
        const extensionUri = this.extension.extensionUri;

        const codiconsCSSUri = getUri(webview, extensionUri, ['css', 'codicon.css']);
        const bundleJSUri = getBundleUri(webview, extensionUri, ['minimap', 'bundle.js']);

        webview.html = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="Content-Security-Policy" 
                content="default-src http://*.fontawesome.com  ${webview.cspSource} data: 'unsafe-inline' 'unsafe-eval';">
            <link id="codicon-css" href="${codiconsCSSUri}" rel="stylesheet" />
            <title>Minimap</title>
        </head>
        <body>
            <big-minimap-webview></big-minimap-webview>
            <script type="module" src="${bundleJSUri}"></script>
        </body>
        </html>`;
    }

    protected override handleConnection(): void {
        // ==== Webview Extension Host ====
        this.extensionHostConnection.onActionMessage(message => {
            if (UpdateModelAction.is(message.action) || SetModelAction.is(message.action)) {
                this.extensionHostConnection.send(RequestMinimapExportSvgAction.create());
            }
        });
        this.extensionHostConnection.onNoActiveClient(() => {
            this.webviewViewConnection.send(MinimapExportSvgAction.create());
        });

        // ==== Webview View Connection ====
        this.webviewViewConnection.onActionMessage(message => {
            if (message.action.kind === 'minimapIsReady') {
                this.extensionHostConnection.send(RequestMinimapExportSvgAction.create());
                this.extensionHostConnection.forwardCachedActionsToWebview();
            } else {
                this.extensionHostConnection.send(message.action);
            }
        });
    }
}
