/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { MinimapExportSvgAction, RequestMinimapExportSvgAction } from '@borkdominik-biguml/big-minimap';
import type { BIGGLSPVSCodeConnector, BIGWebviewProviderContext } from '@borkdominik-biguml/big-vscode-integration/vscode';
import { BIGReactWebview, TYPES, type ExperimentalModelState } from '@borkdominik-biguml/big-vscode-integration/vscode';
import { RequestExportSvgAction } from '@eclipse-glsp/protocol';
import { inject, injectable, postConstruct } from 'inversify';
import path from 'path';
import * as vscode from 'vscode';
import { RequestExportSnapshotAction } from '../common/actions/request-export-snapshot-action.js';
import { FileSaveResponse } from '../common/actions/file-save-action.js';
import { type Snapshot } from '../common/snapshot.js';
import { RequestRestoreSnapshotAction } from '../common/actions/request-restore-snapshot-action.js';
import { RestoreSnapshotResponseAction } from '../common/actions/restore-snapshot-response-action.js';

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


    private lastSnapshotTime = 0;
    private currentModelState: ExperimentalModelState | null = null;
    private timeline: Snapshot[] = [];

    @postConstruct()
    protected override init(): void {
        super.init();
        console.log('Revision Management Provider init');

        // Uncomment line below if you wish to clear the VSCode storage
        //this.clearVSCodeStorage();

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

                    console.log('[Snapshot] Triggering exportSvg via RequestMinimapExportSvgAction');
                    this.connector.sendActionToActiveClient(RequestMinimapExportSvgAction.create());

                }
            }),

            umlWatcher.onDidCreate(uri => {
                console.log('[fswatcher] File created:', uri.fsPath);
                // Optional: handle creation logic
            }),
            

            umlWatcher
        );

       this.toDispose.push(
            this.connector.onClientActionMessage(message => {
                if (MinimapExportSvgAction.is(message.action)) {
                    const { svg = '', bounds } = message.action;

                    const now = Date.now();
                    if (now - this.lastSnapshotTime < 1000) {
                        console.log('[Snapshot] Too soon since last snapshot — skipping.');
                        return;
                    }
                    this.lastSnapshotTime = now;

                    if (this.timeline.length > 0 && this.timeline[this.timeline.length - 1].svg === svg) {
                        console.log('[Snapshot] Duplicate SVG detected — skipping.');
                        return;
                    }

                    console.log('[Snapshot] Received SVG from Minimap Export. Length:', svg.length);
                    this.timeline.push({
                        id: this.timeline.length.toString(),
                        timestamp: new Date().toISOString(),
                        message: 'File saved',
                        svg,
                        bounds,
                        state: this.currentModelState!
                    });

                    this.updateTimeline();
                }
            })
        );

        // Handle ExportSnapshot action triggered by webview button
        this.toDispose.push(
             this.actionListener.handleVSCodeRequest(RequestExportSnapshotAction.KIND, async message => {
                console.log('[RevisionManagementProvider] ExportSnapshot action received');
                this.connector.sendActionToActiveClient(RequestExportSvgAction.create());
                return { kind: 'noop' } as any;
            })
        );

        this.toDispose.push(
            this.actionListener.handleVSCodeRequest(RequestRestoreSnapshotAction.KIND, async (message) => {
                const action = message.action as RequestRestoreSnapshotAction;
                const snapshotId = action.snapshotId;

                console.log(`[RevisionManagementProvider] Restore request received for snapshot ID: ${snapshotId}`);

                const snapshotIndex = this.timeline.findIndex(s => s.id === snapshotId);
                if (snapshotIndex !== -1) {
                    this.timeline = this.timeline.slice(0, snapshotIndex + 1);
                    const key = this.getTimelineKey();
                    await this.extensionContext.globalState.update(key, this.timeline);
                    console.log(`[RevisionManagementProvider] Timeline after restore saved for key: ${key} (entries: ${this.timeline.length})`);

                    this.updateTimeline();
                    // TODO: restore current modelstate to this.timeline[snapshotIndex].state, so it's also updated on the main screen.
                } else {
                    console.warn(`[RevisionManagementProvider] Snapshot with ID ${snapshotId} not found.`);
                }

                return RestoreSnapshotResponseAction.create(action.requestId);
            })
        );


        this.toDispose.push(this.actionCache);
    }

    protected override handleConnection(): void {
        super.handleConnection();

        const state = this.modelState.getModelState();
        if (state) {
            console.log('[RevisionManagementProvider] Initial model state loaded via getModelState');
            this.currentModelState = state;

            const key = this.getTimelineKey();
            const stored = this.extensionContext.globalState.get<Snapshot[]>(key) ?? [];
            console.log('[Timeline] Loaded from globalState for', key, ':', stored.length);
            this.timeline = stored;

            this.updateTimeline();
        } else {
            console.log('[RevisionManagementProvider] No initial model state available');
        }
        
        console.log('Revision Management Provider handleConnection');

        this.toDispose.push(
            this.actionCache.onDidChange(message => this.webviewConnector.dispatch(message)),
            this.webviewConnector.onReady(() => {
                console.log('Revision Management Provider webviewConnector onReady');
                this.webviewConnector.dispatch(this.actionCache.getActions());
            }),
            this.webviewConnector.onVisible(() => {
                this.webviewConnector.dispatch(this.actionCache.getActions())
            }),
            this.connectionManager.onDidActiveClientChange(() => {
                console.log('Revision Management Provider webviewConnector onDidActiveClientChange');
                this.updateTimeline();
            }),
            this.connectionManager.onNoActiveClient(() => {
                console.log('Revision Management Provider webviewConnector onNoActiveClient');
                this.currentModelState = null;
                this.updateTimeline();
            }),
            this.connectionManager.onNoConnection(() => {
                console.log('Revision Management Provider webviewConnector onNoConnection');
                this.currentModelState = null;
                this.updateTimeline();
            }),
            this.modelState.onDidChangeModelState((event) => {
                console.log('Revision Management Provider webviewConnector onDidChangeModelState', event.state);
                this.currentModelState = event.state;
                const key = this.getTimelineKey();
                const stored = this.extensionContext.globalState.get<Snapshot[]>(key) ?? [];
                console.log('[Timeline] Loaded from globalState for', key, ':', stored.length);
                this.timeline = stored;
                this.updateTimeline();
            }),
            vscode.commands.registerCommand('timeline.import', () => {
                console.log('timeline.import command triggered');
                this.webviewView?.webview.postMessage({ action: 'import' });
            }),
            vscode.commands.registerCommand('timeline.export', () => {
                console.log('timeline.export command triggered');
                this.webviewView?.webview.postMessage({ action: 'export' });
            }),  
        );
    }


    protected updateTimeline(): void {
        if (!this.currentModelState) {
            console.warn('[Timeline] Skipped update — no model loaded yet');
            return;
        }

        console.log('Revision Management Provider updateTimeline', this.currentModelState);
        const key = this.getTimelineKey();
        this.extensionContext.globalState.update(key, this.timeline).then(() => {
            console.log('[Timeline] Saved to globalState for', key, ':', this.timeline.length);
        });
        
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
    
    private getTimelineKey(): string {
        const modelId = this.currentModelState?.getSourceModel().id;
        return `revisionTimeline:${modelId ?? 'unknown'}`;
    }

    private async clearVSCodeStorage(): Promise<void> {
        const keys = this.extensionContext.globalState.keys();

                for (const key of keys) {
                    await this.extensionContext.globalState.update(key, undefined);
                    console.log(`[Timeline] Cleared key: ${key}`);
                }

                console.log('[Timeline] All globalState keys cleared.');
    }
}
