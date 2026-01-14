/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { BIGReactWebview, type BIGWebviewProviderContext } from '@borkdominik-biguml/big-vscode-integration/vscode';
import { inject, injectable, postConstruct } from 'inversify';
import * as vscode from 'vscode';
import { DeleteSnapshotResponseAction } from '../common/actions/delete-snapshot-response-action.js';
import { FileSaveResponse } from '../common/actions/file-save-action.js';
import { RequestChangeSnapshotNameAction } from '../common/actions/request-change-snapshot-name-action.js';
import { RequestDeleteSnapshotAction } from '../common/actions/request-delete-snapshot-action.js';
import { RequestExportSnapshotAction } from '../common/actions/request-export-snapshot-action.js';
import { RequestImportSnapshotAction } from '../common/actions/request-import-snapshot-action.js';
import { RequestRestoreSnapshotAction } from '../common/actions/request-restore-snapshot-action.js';
import { RequestSaveFileAction } from '../common/actions/request-save-file-action.js';
import { RestoreSnapshotResponseAction } from '../common/actions/restore-snapshot-response-action.js';
import { RevisionManagementService } from './revision-management.service.js';

export const RevisionManagementId = Symbol('RevisionmanagementViewId');

@injectable()
export class RevisionManagementProvider extends BIGReactWebview {
    @inject(RevisionManagementId)
    viewId: string;

    @inject(RevisionManagementService)
    protected readonly service: RevisionManagementService;

    protected override cssPath = ['revision-management', 'bundle.css'];
    protected override jsPath = ['revision-management', 'bundle.js'];
    protected readonly actionCache = this.actionListener.createCache([FileSaveResponse.KIND]);

    @postConstruct()
    protected override init(): void {
        super.init();
        console.log('Revision Management Provider init');

        this.toDispose.push(
            this.service.onDidChangeTimeline(timeline => {
                this.webviewConnector.dispatch(
                    FileSaveResponse.create({
                        responseId: '',
                        timeline
                    })
                );
            })
        );

        // Handle ExportSnapshot action triggered by webview button
        this.toDispose.push(
            this.actionListener.handleVSCodeRequest(RequestExportSnapshotAction.KIND, async () => {
                console.log('[RevisionManagementProvider] ExportSnapshot action received');
                this.service.requestExportSvg();
                return { kind: 'noop' } as any;
            })
        );

        this.toDispose.push(
            this.actionListener.handleVSCodeRequest(RequestSaveFileAction.KIND, async () => {
                console.log('[RevisionManagementProvider] RequestSaveFileAction received');
                this.service.createSnapshot('Manual entry');
                return { kind: 'noop' } as any;
            })
        );

        this.toDispose.push(
            this.actionListener.handleVSCodeRequest(RequestImportSnapshotAction.KIND, async (message: any) => {
                console.log('[RevisionManagementProvider] ImportSnapshot action received');
                await this.service.importSnapshot(message.action.importedSnapshots);
                return { kind: 'noop' } as any;
            })
        );

        this.toDispose.push(
            this.actionListener.handleVSCodeRequest(RequestChangeSnapshotNameAction.KIND, async (message: any) => {
                console.log('[RevisionManagementProvider] RequestChangeSnapshotNameAction action received');
                await this.service.changeSnapshotName(message.action.snapshotId, message.action.name);
                return { kind: 'noop' } as any;
            })
        );

        this.toDispose.push(
            this.actionListener.handleVSCodeRequest(RequestRestoreSnapshotAction.KIND, async message => {
                const action = message.action as RequestRestoreSnapshotAction;
                const snapshotId = action.snapshotId;

                console.log(`[RevisionManagementProvider] Restore request received for snapshot ID: ${snapshotId}`);
                await this.service.restoreSnapshot(snapshotId);

                return RestoreSnapshotResponseAction.create(action.requestId);
            })
        );

        this.toDispose.push(
            this.actionListener.handleVSCodeRequest(RequestDeleteSnapshotAction.KIND, async message => {
                const action = message.action as RequestDeleteSnapshotAction;
                const snapshotId = action.snapshotId;

                console.log(`[RevisionManagementProvider] Delete request received for snapshot ID: ${snapshotId}`);
                await this.service.deleteSnapshot(snapshotId);

                return DeleteSnapshotResponseAction.create(action.requestId);
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
                this.webviewConnector.dispatch(this.actionCache.getActions());
                // Send initial state
                this.webviewConnector.dispatch(
                    FileSaveResponse.create({
                        responseId: '',
                        timeline: this.service.getTimeline()
                    })
                );
            }),
            this.webviewConnector.onVisible(() => {
                this.webviewConnector.dispatch(this.actionCache.getActions());
                // Send initial state
                this.webviewConnector.dispatch(
                    FileSaveResponse.create({
                        responseId: '',
                        timeline: this.service.getTimeline()
                    })
                );
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
