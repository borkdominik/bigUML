/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { BIGReactWebview, type ExperimentalModelState } from '@borkdominik-biguml/big-vscode-integration/vscode';
import { inject, injectable, postConstruct } from 'inversify';
import * as vscode from 'vscode';
import { FileSaveResponse } from '../common/file-save-action.js';
import { type Snapshot } from '../common/snapshot.js';

export const RevisionManagementId = Symbol('RevisionmanagementViewId');

@injectable()
export class RevisionManagementProvider extends BIGReactWebview {
    @inject(RevisionManagementId)
    viewId: string;

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
                const affectedResource = this.currentModelState?.getResources().find(resource => this.matchesUri(resource.uri, uri.fsPath));
                if (affectedResource && this.currentModelState) {
                    this.timeline.push({
                        id: this.timeline.length.toString(),
                        timestamp: new Date().toISOString(),
                        author: "User", // todo not necessary
                        message: "File saved", 
                        svg: "", // todo add svg
                        state: this.currentModelState
                    });
                    this.updateTimeline();
                }               
            }),

            umlWatcher.onDidCreate(uri => {
                console.log('[fswatcher] File created:', uri.fsPath);
                // todo: maybe handle file creation
            }),

            umlWatcher
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

    private matchesUri(uri1: string, uri2: string): boolean {
        const normalizedUri1 = this.normalizeUri(uri1);
        const normalizedUri2 = this.normalizeUri(uri2);

        return normalizedUri1 === normalizedUri2;
    }

    private normalizeUri(uri: string): string {
        // 1. Strip any file:// prefix (with 2 or 3 slashes) in a case-insensitive way
        let p = uri.replace(/^file:\/\/\/?/i, "");
      
        // 2. Replace all backslashes with forward-slashes
        p = p.replace(/\\/g, "/");
      
        // 3. Collapse multiple slashes into one
        p = p.replace(/\/{2,}/g, "/");
      
        // 4. If there’s a leading slash before a Windows drive-letter, drop it:
        //    "/c:/foo" → "c:/foo"
        p = p.replace(/^\/([a-zA-Z]:)/, "$1");
      
        // 5. Lower-case the drive letter, e.g. "C:/Users" → "c:/Users"
        p = p.replace(/^([A-Z]):/, (_, d) => d.toLowerCase() + ":");
      
        // 6. Re-add exactly one file:/// prefix
        return "file:///" + p;
      }
}
