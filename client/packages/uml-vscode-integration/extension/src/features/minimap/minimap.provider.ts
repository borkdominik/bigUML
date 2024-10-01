/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { MinimapExportSvgAction, RequestMinimapExportSvgAction } from '@borkdominik-biguml/uml-protocol';
import {
    Action,
    ActionMessage,
    Bounds,
    InitializeCanvasBoundsAction,
    SetViewportAction,
    UpdateModelAction,
    Viewport
} from '@eclipse-glsp/client';
import { SetModelAction } from '@eclipse-glsp/protocol';
import { injectable, postConstruct } from 'inversify';
import { VSCodeSettings } from '../../language';
import { getBundleUri, getUri } from '../../utilities/webview';
import { ProviderWebviewContext, UMLWebviewProvider } from '../../vscode/webview/webview-provider';

@injectable()
export class MinimapProvider extends UMLWebviewProvider {
    get id(): string {
        return VSCodeSettings.minimap.viewId;
    }

    protected override retainContextWhenHidden = true;
    protected currentViewPort?: Viewport;
    protected currentCanvasBounds?: Bounds;
    protected currentModelBounds?: Bounds;

    protected currentMinimapExportSvgAction?: MinimapExportSvgAction;

    @postConstruct()
    override initialize(): void {
        super.initialize();
        // Handle editor visibility changes
        this.connector.onDidClientViewStateChange(() => {
            if (this.connector.clients.some(c => c.webviewEndpoint.webviewPanel.active)) {
                if (this.currentMinimapExportSvgAction) {
                    this.sendActionToWebview(this.currentMinimapExportSvgAction);
                }
                if (this.currentCanvasBounds) {
                    this.sendActionToWebview(InitializeCanvasBoundsAction.create(this.currentCanvasBounds));
                }
                if (this.currentViewPort) {
                    this.sendActionToWebview(SetViewportAction.create('viewport', this.currentViewPort));
                }
            } else {
                this.sendActionToWebview(MinimapExportSvgAction.create());
            }
        });
        this.connector.onDidClientDispose(() => {
            if (this.connector.documents.length === 0) {
                this.sendActionToWebview(MinimapExportSvgAction.create());
            }
        });
        // With this method access to the GLSP cycle is provided and action can be catched
        this.connector.onActionMessage(message => {
            const { action } = message;
            if (MinimapExportSvgAction.is(action)) {
                this.currentMinimapExportSvgAction = action;
                this.currentModelBounds = action.modelBounds;

                if (this.webviewView?.visible) {
                    this.sendActionToWebview(action); // Sends the action to `minimap-webview.component.ts`
                }
            }
            if (InitializeCanvasBoundsAction.KIND === action.kind) {
                this.currentCanvasBounds = (action as InitializeCanvasBoundsAction).newCanvasBounds;

                if (this.webviewView?.visible) {
                    this.sendActionToWebview(action);
                }
            }
            if (SetViewportAction.KIND === action.kind) {
                this.currentViewPort = (action as SetViewportAction).newViewport;
            }
            if (UpdateModelAction.is(action) || SetModelAction.is(action)) {
                this.connector.sendActionToActiveClient(RequestMinimapExportSvgAction.create());
            }

            if (SetViewportAction.is(action)) {
                this.currentViewPort = action.newViewport;
                if (this.webviewView?.visible) {
                    this.sendActionToWebview(action);
                }
                // This action is triggered when something to the viewport changes.
            }
        });
    }

    // This is the return of the connected webview where it is possible to react on different returns, in this case `minimap-webview.component.ts`
    protected override onActionMessage(message: ActionMessage<Action>): void {
        if (message.action.kind === 'minimapIsReady') {
            this.connector.sendActionToActiveClient(RequestMinimapExportSvgAction.create());

            if (this.currentCanvasBounds) {
                this.sendActionToWebview(InitializeCanvasBoundsAction.create(this.currentCanvasBounds));
            }
            if (this.currentViewPort) {
                this.sendActionToWebview(SetViewportAction.create('viewport', this.currentViewPort));
            }
        }
        if (SetViewportAction.is(message.action)) {
            this.connector.sendActionToActiveClient(message.action);
        }
    }

    // Send the current state after the webview gets visible (again) or the first time
    protected override onWebviewVisiblitlyChanged(): void {
        if (this.webviewView?.visible) {
            if (this.currentMinimapExportSvgAction) {
                this.sendActionToWebview(this.currentMinimapExportSvgAction);
            }
            if (this.currentCanvasBounds) {
                this.sendActionToWebview(InitializeCanvasBoundsAction.create(this.currentCanvasBounds));
            }
            if (this.currentViewPort) {
                this.sendActionToWebview(SetViewportAction.create('viewport', this.currentViewPort));
            }
        }
    }

    protected resolveHTML(providerContext: ProviderWebviewContext): void {
        const webview = providerContext.webviewView.webview;
        const extensionUri = this.extension.extensionUri;

        const codiconsCSSUri = getUri(webview, extensionUri, ['node_modules', '@vscode/codicons', 'dist', 'codicon.css']);
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
}
