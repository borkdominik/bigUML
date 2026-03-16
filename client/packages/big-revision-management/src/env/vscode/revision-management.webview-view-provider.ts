/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import type { WebviewMessenger, WebviewViewProviderOptions } from '@borkdominik-biguml/big-vscode/vscode';
import { type CacheActionListener, TYPES, WebviewViewProvider } from '@borkdominik-biguml/big-vscode/vscode';
import { DisposableCollection } from '@eclipse-glsp/vscode-integration';
import { inject, injectable, postConstruct } from 'inversify';
import type { Disposable } from 'vscode';
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
export class RevisionManagementWebviewViewProvider extends WebviewViewProvider {
    @inject(RevisionManagementService)
    protected readonly service: RevisionManagementService;

    protected actionCache: CacheActionListener;

    constructor(@inject(TYPES.WebviewViewOptions) options: WebviewViewProviderOptions) {
        super({
            viewId: options.viewType,
            viewType: options.viewType,
            htmlOptions: {
                files: {
                    js: [['revision-management', 'bundle.js']],
                    css: [['revision-management', 'bundle.css']]
                }
            }
        });
    }

    @postConstruct()
    protected init(): void {
        this.actionCache = this.actionListener.createCache([FileSaveResponse.KIND]);
        this.toDispose.push(this.actionCache);
    }

    protected override resolveWebviewProtocol(messenger: WebviewMessenger): Disposable {
        const disposables = new DisposableCollection();
        disposables.push(
            super.resolveWebviewProtocol(messenger),
            this.actionCache.onDidChange(message => this.actionMessenger.dispatch(message)),
            vscode.commands.registerCommand('timeline.import', () => {
                // console.log('timeline.import command triggered');
                this.webviewView?.webview.postMessage({ action: 'import' });
            }),
            vscode.commands.registerCommand('timeline.export', () => {
                // console.log('timeline.export command triggered');
                this.webviewView?.webview.postMessage({ action: 'export' });
            })
        );
        this.toDispose.push(
            this.service.onDidChangeTimeline(timeline => {
                this.actionMessenger.dispatch(
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
                // console.log(
                //   "[RevisionManagementProvider] ExportSnapshot action received",
                // );
                this.service.requestExportSvg();
                return { kind: 'noop' } as any;
            })
        );

        this.toDispose.push(
            this.actionListener.handleVSCodeRequest(RequestSaveFileAction.KIND, async () => {
                // console.log('[RevisionManagementProvider] RequestSaveFileAction received');
                this.service.createSnapshot('Manual entry');
                return { kind: 'noop' } as any;
            })
        );

        this.toDispose.push(
            this.actionListener.handleVSCodeRequest(RequestImportSnapshotAction.KIND, async (message: any) => {
                // console.log('[RevisionManagementProvider] ImportSnapshot action received');
                await this.service.importSnapshot(message.action.importedSnapshots);
                return { kind: 'noop' } as any;
            })
        );

        this.toDispose.push(
            this.actionListener.handleVSCodeRequest(RequestChangeSnapshotNameAction.KIND, async (message: any) => {
                // console.log('[RevisionManagementProvider] RequestChangeSnapshotNameAction action received');
                await this.service.changeSnapshotName(message.action.snapshotId, message.action.name);
                return { kind: 'noop' } as any;
            })
        );

        this.toDispose.push(
            this.actionListener.handleVSCodeRequest(RequestRestoreSnapshotAction.KIND, async message => {
                const action = message.action as RequestRestoreSnapshotAction;
                const snapshotId = action.snapshotId;

                // console.log(`[RevisionManagementProvider] Restore request received for snapshot ID: ${snapshotId}`);
                await this.service.restoreSnapshot(snapshotId);

                return RestoreSnapshotResponseAction.create(action.requestId);
            })
        );

        this.toDispose.push(
            this.actionListener.handleVSCodeRequest(RequestDeleteSnapshotAction.KIND, async message => {
                const action = message.action as RequestDeleteSnapshotAction;
                const snapshotId = action.snapshotId;

                // console.log(`[RevisionManagementProvider] Delete request received for snapshot ID: ${snapshotId}`);
                await this.service.deleteSnapshot(snapshotId);

                return DeleteSnapshotResponseAction.create(action.requestId);
            })
        );

        return disposables;
    }

    protected override handleOnReady(): void {
        this.actionMessenger.dispatch(this.actionCache.getActions());
        // Send initial state
        this.actionMessenger.dispatch(
            FileSaveResponse.create({
                responseId: '',
                timeline: this.service.getTimeline()
            })
        );
    }

    protected override handleOnVisible(): void {
        this.actionMessenger.dispatch(this.actionCache.getActions());
        // Send initial state
        this.actionMessenger.dispatch(
            FileSaveResponse.create({
                responseId: '',
                timeline: this.service.getTimeline()
            })
        );
    }
}
