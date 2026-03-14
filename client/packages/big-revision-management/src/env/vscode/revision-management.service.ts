/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { MinimapExportSvgAction, RequestMinimapExportSvgAction } from '@borkdominik-biguml/big-minimap';
import {
    TYPES,
    type BIGGLSPVSCodeConnector,
    type ConnectionManager,
    type GLSPModelState,
    type GLSPServerModelState
} from '@borkdominik-biguml/big-vscode/vscode';
import { RequestExportSvgAction } from '@eclipse-glsp/protocol';
import { inject, injectable, postConstruct } from 'inversify';
import * as vscode from 'vscode';
import { type Snapshot } from '../common/snapshot.js';

@injectable()
export class RevisionManagementService {
    @inject(TYPES.GLSPVSCodeConnector)
    protected readonly connector!: BIGGLSPVSCodeConnector;

    @inject(TYPES.ConnectionManager)
    protected readonly connectionManager!: ConnectionManager;

    @inject(TYPES.GLSPServerModelState)
    protected readonly modelState!: GLSPServerModelState;

    @inject(TYPES.ExtensionContext)
    protected readonly extensionContext!: vscode.ExtensionContext;

    protected readonly onDidChangeTimelineEmitter = new vscode.EventEmitter<Snapshot[]>();
    readonly onDidChangeTimeline = this.onDidChangeTimelineEmitter.event;

    private lastSnapshotTime = 0;
    private currentModelState: GLSPModelState | null = null;
    private timeline: Snapshot[] = [];
    private svgRequestId: string | null = null;
    protected toDispose: vscode.Disposable[] = [];

    @postConstruct()
    protected init(): void {
        // console.log('RevisionManagementService init');

        const config = vscode.workspace.getConfiguration('bigUML');
        const configPersist = config.get<boolean>('timeline.persistent');

        if (configPersist === false) {
            this.clearVSCodeStorage();
        }

        const umlWatcher = vscode.workspace.createFileSystemWatcher('**/*.uml');

        this.toDispose.push(
            umlWatcher.onDidChange(async _uri => {
                const configOnSave = config.get<boolean>('timeline.onSave');
                if (configOnSave === false) {
                    return;
                }

                // console.log('[fswatcher] File changed (saved):', uri.fsPath);
                if (!this.connectionManager.hasActiveClient()) {
                    console.warn('[Snapshot] No active GLSP client available');
                    return;
                }

                // console.log('[Snapshot] Triggering exportSvg via RequestMinimapExportSvgAction');
                this.createSnapshot('File saved');
            }),

            umlWatcher.onDidCreate(_uri => {
                // console.log('[fswatcher] File created:', uri.fsPath);
            }),

            umlWatcher
        );

        this.toDispose.push(
            this.connector.onClientActionMessage((message: any) => {
                if (MinimapExportSvgAction.is(message.action) && this.svgRequestId !== null) {
                    // console.log('[RevisionManagementService] Received MinimapExportSvgAction message:', message);
                    const timelineEntry = this.timeline.find(s => s.id === this.svgRequestId);
                    if (timelineEntry) {
                        const { svg = '', bounds } = message.action;
                        timelineEntry.svg = svg;
                        timelineEntry.bounds = bounds;
                        this.svgRequestId = null;
                        this.updateTimeline();
                    }
                    return { kind: 'noop' } as any;
                }
            })
        );

        this.handleConnection();
    }

    protected handleConnection(): void {
        const state = this.modelState.getModelState();
        if (state) {
            // console.log('[RevisionManagementService] Initial model state loaded via getModelState');
            this.currentModelState = state;

            const key = this.getTimelineKey();
            const stored = this.extensionContext.globalState.get<Snapshot[]>(key) ?? [];
            // console.log('[Timeline] Loaded from globalState for', key, ':', stored.length);
            this.timeline = stored;

            this.updateTimeline();
        } else {
            // console.log('[RevisionManagementService] No initial model state available');
        }

        this.toDispose.push(
            this.connectionManager.onDidActiveClientChange(() => {
                // console.log('RevisionManagementService onDidActiveClientChange');
                this.updateTimeline();
            }),
            this.connectionManager.onNoActiveClient(() => {
                // console.log('RevisionManagementService onNoActiveClient');
                this.currentModelState = null;
                this.updateTimeline();
            }),
            this.connectionManager.onNoConnection(() => {
                // console.log('RevisionManagementService onNoConnection');
                this.currentModelState = null;
                this.updateTimeline();
            }),
            this.modelState.onDidChangeModelState(event => {
                // console.log('RevisionManagementService onDidChangeModelState', event.state);
                this.currentModelState = event.state;
                const key = this.getTimelineKey();
                const stored = this.extensionContext.globalState.get<Snapshot[]>(key) ?? [];
                // console.log('[Timeline] Loaded from globalState for', key, ':', stored.length);
                this.timeline = stored;
                this.updateTimeline();
            })
        );
    }

    getTimeline(): Snapshot[] {
        return this.timeline;
    }

    async importSnapshot(importedSnapshots: Snapshot[]): Promise<void> {
        this.timeline = importedSnapshots;
        this.updateTimeline();
    }

    async changeSnapshotName(snapshotId: string, name: string): Promise<void> {
        const snapshot = this.timeline.find(s => s.id === snapshotId);
        if (snapshot) {
            snapshot.message = name;
        }
        this.updateTimeline();
    }

    async deleteSnapshot(snapshotId: string): Promise<void> {
        const snapshotIndex = this.timeline.findIndex(s => s.id === snapshotId);
        if (snapshotIndex === -1) {
            console.warn(`[RevisionManagementService] Snapshot with ID ${snapshotId} not found`);
            return;
        }
        this.timeline = [...this.timeline.slice(0, snapshotIndex), ...this.timeline.slice(snapshotIndex + 1)];
        const key = this.getTimelineKey();
        await this.extensionContext.globalState.update(key, this.timeline);
        this.updateTimeline();
    }

    async restoreSnapshot(snapshotId: string): Promise<void> {
        const snapshotIndex = this.timeline.findIndex(s => s.id === snapshotId);
        if (snapshotIndex !== -1) {
            const snapshot = this.timeline[snapshotIndex];

            // console.log(`[RevisionManagementService] Restoring snapshot with ID ${snapshotId}:`, snapshot);

            // restore file (does not work properly - to remove)
            if (snapshot.resources) {
                for (const resource of snapshot.resources) {
                    const uri = vscode.Uri.parse(resource.uri);
                    const encoded = new TextEncoder().encode(resource.content);
                    await vscode.workspace.fs.writeFile(uri, encoded);
                }
            }

            // todo: restore snapshot properly by dispatching an action to the server using the saved snapshot.model
            // @haydar: add server action
            // ... dispatch RestoreModelStateAction(snapshot.model) ...

            this.timeline = this.timeline.slice(0, snapshotIndex + 1);
            const key = this.getTimelineKey();
            await this.extensionContext.globalState.update(key, this.timeline);
            // console.log(`[RevisionManagementService] Timeline after restore saved for key: ${key} (entries: ${this.timeline.length})`);

            this.updateTimeline();
        }
    }

    requestExportSvg(): void {
        this.connector.sendActionToActiveClient(RequestExportSvgAction.create());
    }

    createSnapshot(message: string): void {
        if (!this.currentModelState) {
            console.warn('[Snapshot] No current model state available');
            return;
        }

        const resource = this.currentModelState.getResource();

        const now = Date.now();
        if (now - this.lastSnapshotTime < 1000) {
            // console.log('[Snapshot] Too soon since last snapshot — skipping.');
            return;
        }
        this.lastSnapshotTime = now;

        const snapshotResources = [
            {
                uri: resource.uri,
                content: resource.content
            }
        ];

        const id = this.timeline.length.toString();
        this.timeline.push({
            id,
            timestamp: new Date().toISOString(),
            message,
            resources: snapshotResources,
            model: this.currentModelState.getResource()
        });

        this.svgRequestId = id;
        this.updateTimeline();
        this.connector.sendActionToActiveClient(RequestMinimapExportSvgAction.create());
    }

    private updateTimeline(): void {
        if (!this.currentModelState) {
            console.warn('[Timeline] Skipped update — no model loaded yet');
            return;
        }

        // console.log('RevisionManagementService updateTimeline', this.currentModelState);
        const key = this.getTimelineKey();
        this.extensionContext.globalState.update(key, this.timeline).then(() => {
            // console.log('[Timeline] Saved to globalState for', key, ':', this.timeline.length);
        });

        this.onDidChangeTimelineEmitter.fire(this.timeline);
    }

    private getTimelineKey(): string {
        const modelId = this.currentModelState?.getResource().uri;
        return `revisionTimeline:${modelId ?? 'unknown'}`;
    }

    private async clearVSCodeStorage(): Promise<void> {
        const keys = this.extensionContext.globalState.keys();
        const prefix = 'revisionTimeline:';

        for (const key of keys) {
            if (!key.startsWith(prefix)) {
                continue;
            }

            await this.extensionContext.globalState.update(key, undefined);
            // console.log(`[Timeline] Cleared key: ${key}`);
        }

        // console.log('[Timeline] All revisionTimeline keys cleared.');
    }

    dispose(): void {
        this.toDispose.forEach(d => d.dispose());
    }
}
