/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { BIGReactWebview } from '@borkdominik-biguml/big-vscode-integration/vscode';
import { inject, injectable, postConstruct } from 'inversify';
import { RevisionManagementResponse, RequestRevisionManagementAction } from '../common/revision-management.action.js';
import * as vscode from 'vscode';
export const RevisionManagementId = Symbol('RevisionmanagementViewId');
import type { BIGWebviewProviderContext } from '@borkdominik-biguml/big-vscode-integration/vscode';


@injectable()
export class RevisionManagementProvider extends BIGReactWebview {
    @inject(RevisionManagementId)
    viewId: string;

    protected override cssPath = ['revision-management', 'bundle.css'];
    protected override jsPath = ['revision-management', 'bundle.js'];
    protected readonly actionCache = this.actionListener.createCache([RevisionManagementResponse.KIND]);

    @postConstruct()
    protected override init(): void {
        super.init();
        
        this.toDispose.push(this.actionCache);
    }

    protected override handleConnection(): void {
        super.handleConnection();

        this.toDispose.push(
            this.actionCache.onDidChange(message => this.webviewConnector.dispatch(message)),
            this.webviewConnector.onReady(() => {
                this.requestCount();
                this.webviewConnector.dispatch(this.actionCache.getActions());
            }),
            this.webviewConnector.onVisible(() => this.webviewConnector.dispatch(this.actionCache.getActions())),
            this.connectionManager.onDidActiveClientChange(() => {
                this.requestCount();
            }),
            this.connectionManager.onNoActiveClient(() => {
                // Send a message to the webview when there is no active client
                this.webviewConnector.dispatch(RevisionManagementResponse.create());
            }),
            this.connectionManager.onNoConnection(() => {
                // Send a message to the webview when there is no glsp client
                this.webviewConnector.dispatch(RevisionManagementResponse.create());
            }),
            this.modelState.onDidChangeModelState(() => {
                this.requestCount();
            }),
            vscode.commands.registerCommand('timeline.import', () => {
                console.log('timeline.import command triggered');
                this.webviewView?.webview.postMessage({ action: 'import' });
            }),
            
            
            vscode.commands.registerCommand('timeline.export', () => {
                console.log('timeline.export command triggered');
                this.webviewView?.webview.postMessage({ action: 'export' });
            })
            
        );
    }

    protected requestCount(): void {
        this.actionDispatcher.dispatch(
            RequestRevisionManagementAction.create({
                increase: 0
            })
        );
    }
    protected getCssUri(webview: vscode.Webview, ...path: string[]): vscode.Uri {
        return webview.asWebviewUri(vscode.Uri.joinPath(this.extensionContext.extensionUri, 'webviews', ...path));
    }
    
    protected getJsUri(webview: vscode.Webview, ...path: string[]): vscode.Uri {
        return webview.asWebviewUri(vscode.Uri.joinPath(this.extensionContext.extensionUri, 'webviews', ...path));
    }
    

    protected override resolveHTML(context: BIGWebviewProviderContext): void {
        const webview = context.webviewView.webview;
    
        const cssUri = this.getCssUri(webview, ...this.cssPath);
        const jsUri = this.getJsUri(webview, ...this.jsPath);
    
        const html = /* html */ `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Revision Management</title>
                <link rel="stylesheet" type="text/css" href="${cssUri}" />
            </head>
            <body style="margin:0; position:relative;">
            <div id="root"></div>
            <script type="module" src="${jsUri}"></script>
            </body>
            </html>
        `;
    
        webview.html = html;
    }
    
}
