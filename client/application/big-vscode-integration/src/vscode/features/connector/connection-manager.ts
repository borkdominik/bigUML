/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { Deferred, type Disposable, DisposableCollection, type GlspVscodeClient } from '@eclipse-glsp/vscode-integration';
import { inject, injectable, postConstruct, preDestroy } from 'inversify';
import * as vscode from 'vscode';
import { TYPES } from '../../vscode-common.types.js';
import type { BIGGLSPVSCodeConnector } from './glsp-vscode-connector.js';

export interface ViewStateChangeEvent extends vscode.WebviewPanelOnDidChangeViewStateEvent {
    client: GlspVscodeClient;
}
@injectable()
export class ConnectionManager implements Disposable {
    @inject(TYPES.GLSPVSCodeConnector)
    protected readonly connector: BIGGLSPVSCodeConnector;

    protected readonly onDidActiveClientChangeEmitter = new vscode.EventEmitter<GlspVscodeClient>();
    readonly onDidActiveClientChange = this.onDidActiveClientChangeEmitter.event;
    protected readonly onNoActiveClientEmitter = new vscode.EventEmitter<void>();
    readonly onNoActiveClient = this.onNoActiveClientEmitter.event;

    protected readonly onDidViewStateChangeEmitter = new vscode.EventEmitter<ViewStateChangeEvent>();
    readonly onDidViewStateChange = this.onDidViewStateChangeEmitter.event;
    protected readonly onDidDisposeEmitter = new vscode.EventEmitter<GlspVscodeClient>();
    readonly onDidDispose = this.onDidDisposeEmitter.event;
    protected readonly onNoConnectionEmitter = new vscode.EventEmitter<void>();
    readonly onNoConnection = this.onNoConnectionEmitter.event;

    protected readonly toDispose = new DisposableCollection();

    get activeClient(): GlspVscodeClient | undefined {
        return this.connector.activeClient;
    }

    hasActiveClient(): boolean {
        return this.connector.clients.some(client => client.webviewEndpoint.webviewPanel.active);
    }

    hasNoActiveClient(): boolean {
        return !this.hasActiveClient();
    }

    hasAnyClient(): boolean {
        return this.connector.clients.length > 0;
    }

    hasNoClient(): boolean {
        return !this.hasAnyClient();
    }

    @postConstruct()
    protected init(): void {
        this.toDispose.push(
            this.connector.onDidRegister(client => {
                this.toDispose.push(this.registerClient(client));
            }),
            this.onDidDispose(() => {
                if (this.hasNoClient()) {
                    this.onNoConnectionEmitter.fire();
                } else if (this.hasNoActiveClient()) {
                    this.onNoActiveClientEmitter.fire();
                }
            })
        );
    }

    @preDestroy()
    dispose(): void {
        this.toDispose.dispose();
    }

    registerClient(client: GlspVscodeClient): Disposable {
        const toDispose = new DisposableCollection();
        const deferred = new Deferred<void>();

        const isReadyListener = client.webviewEndpoint.onActionMessage(message => {
            if (message.action.kind === 'glspIsReady') {
                deferred.resolve();
                isReadyListener.dispose();

                if (client.webviewEndpoint.webviewPanel.active) {
                    this.onDidViewStateChangeEmitter.fire({
                        client,
                        webviewPanel: client.webviewEndpoint.webviewPanel
                    });
                    this.onDidActiveClientChangeEmitter.fire(client);
                }
            }
        });

        toDispose.push(
            isReadyListener,
            client.webviewEndpoint.webviewPanel.onDidChangeViewState(event => {
                this.onDidViewStateChangeEmitter.fire({
                    client,
                    webviewPanel: event.webviewPanel
                });
                if (event.webviewPanel.active) {
                    this.onDidActiveClientChangeEmitter.fire(client);
                }
                if (this.hasNoActiveClient()) {
                    this.onNoActiveClientEmitter.fire();
                }
            }),
            client.webviewEndpoint.webviewPanel.onDidDispose(async () => {
                this.onDidDisposeEmitter.fire(client);
            })
        );

        return toDispose;
    }
}
