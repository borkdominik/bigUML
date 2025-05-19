/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import type { BIGWebviewProviderContext } from '@borkdominik-biguml/big-vscode-integration/vscode';
import { BIGReactWebview, type ExperimentalModelState } from '@borkdominik-biguml/big-vscode-integration/vscode';
import { inject, injectable, postConstruct } from 'inversify';
import path from 'path';
import * as vscode from 'vscode';
import { FileSaveResponse } from '../common/file-save-action.js';
import { type Snapshot } from '../common/snapshot.js';
import { ExportSvgAction, RequestExportSvgAction } from '@eclipse-glsp/protocol';
import type { BIGGLSPVSCodeConnector } from '@borkdominik-biguml/big-vscode-integration/vscode';
import { TYPES } from '@borkdominik-biguml/big-vscode-integration/vscode';


export const RevisionManagementId = Symbol('RevisionmanagementViewId');


@injectable()
export class RevisionManagementProvider extends BIGReactWebview {
    @inject(RevisionManagementId)
    viewId: string;

    @inject(TYPES.GLSPVSCodeConnector)
    protected readonly connector!: BIGGLSPVSCodeConnector;


    protected override cssPath = ['revision-management', 'bundle.css'];
    protected override jsPath = ['revision-management', 'bundle.js'];
    protected readonly actionCache = this.actionListener.createCache([
        FileSaveResponse.KIND
    ]);


    private currentModelState: ExperimentalModelState | null = null;
    private timeline: Snapshot[] = [];

    @postConstruct()
    protected override init(): void {
        super.init();
        console.log('Revision Management Provider init');

        const umlWatcher = vscode.workspace.createFileSystemWatcher('**/*.uml');

        this.toDispose.push(
            umlWatcher.onDidChange(uri => {
                console.log('[fswatcher] File changed (saved):', uri.fsPath);

                const affectedResource = this.currentModelState?.getResources().find(resource =>
                    this.matchesUri(resource.uri, uri.fsPath)
                );

                if (affectedResource && this.currentModelState) {
                    if (!this.connectionManager.hasActiveClient()) {
                        console.warn('[Snapshot] No active GLSP client available');
                        return;
                    }

                    console.log('[Snapshot] Triggering exportSvg via RequestExportSvgAction');
                    this.connector.sendActionToActiveClient(RequestExportSvgAction.create());
                }
            }),

            umlWatcher.onDidCreate(uri => {
                console.log('[fswatcher] File created:', uri.fsPath);
                // Optional: handle creation logic
            }),

            umlWatcher
        );

        // Listen for ExportSvgAction responses
        this.toDispose.push(
            this.connector.onClientActionMessage(message => {
                if (ExportSvgAction.is(message.action)) {
                    const svg = message.action.svg;

                    console.log('[Snapshot] Received SVG. Length:', svg.length);

                    this.timeline.push({
                        id: this.timeline.length.toString(),
                        timestamp: new Date().toISOString(),
                        author: 'User',
                        message: 'File saved',
                        svg,
                        state: this.currentModelState!
                    });

                    this.updateTimeline();
                }
            })
        );

        this.toDispose.push(this.actionCache);
    }

    protected override handleConnection(): void {
        super.handleConnection();

        console.log('Revision Management Provider handleConnection');

        this.toDispose.push(
            this.actionCache.onDidChange(message => this.webviewConnector.dispatch(message)),
            this.webviewConnector.onReady(() => {
                console.log('Revision Management Provider webviewConnector onReady');
                this.timeline = [];
                this.updateTimeline();
                this.webviewConnector.dispatch(this.actionCache.getActions());
            }),
            this.webviewConnector.onVisible(() => this.webviewConnector.dispatch(this.actionCache.getActions())),
            this.connectionManager.onDidActiveClientChange(() => {
                console.log('Revision Management Provider webviewConnector onDidActiveClientChange');
                this.timeline = [];
                this.updateTimeline();
            }),
            this.connectionManager.onNoActiveClient(() => {
                console.log('Revision Management Provider webviewConnector onNoActiveClient');
                this.currentModelState = null;
                this.timeline = [];
                this.updateTimeline();
            }),
            this.connectionManager.onNoConnection(() => {
                console.log('Revision Management Provider webviewConnector onNoConnection');
                this.currentModelState = null;
                this.timeline = [];
                this.updateTimeline();
            }),
            this.modelState.onDidChangeModelState((event) => {
                console.log('Revision Management Provider webviewConnector onDidChangeModelState', event.state);
                this.currentModelState = event.state;
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


    protected updateTimeline(): void {
        console.log('Revision Management Provider updateTimeline', this.currentModelState);
        this.webviewConnector.dispatch(FileSaveResponse.create({
            responseId: '',
            timeline: this.timeline
        }));
    }

    private matchesUri(vsCodeUri: string, pathUri: string): boolean {
        const uri1 = vscode.Uri.parse(vsCodeUri).fsPath;
        const uri2 = path.resolve(pathUri);

        return uri1 === uri2;
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
