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

/**
 * Event emitted when the view state of a webview panel changes.
 */
export interface ViewStateChangeEvent extends vscode.WebviewPanelOnDidChangeViewStateEvent {
    /**
     * The client associated with the webview panel.
     */
    client: GlspVscodeClient;
}

/**
 * A manager for handling connections to GLSP clients in VS Code.
 * It is a wrapper around the GLSP connector to maintain all registered GLSP clients.
 */
@injectable()
export class ConnectionManager implements Disposable {
    @inject(TYPES.GLSPVSCodeConnector)
    protected readonly connector: BIGGLSPVSCodeConnector;

    protected readonly onDidActiveClientChangeEmitter = new vscode.EventEmitter<GlspVscodeClient>();
    /**
     * Event emitted when the active client changes.
     * This event is fired when the active webview panel changes or when a new client is registered.
     */
    readonly onDidActiveClientChange = this.onDidActiveClientChangeEmitter.event;

    protected readonly onNoActiveClientEmitter = new vscode.EventEmitter<void>();
    /**
     * Event emitted when there is no active client.
     * This event is fired when all webview panels are closed.
     */
    readonly onNoActiveClient = this.onNoActiveClientEmitter.event;

    protected readonly onDidViewStateChangeEmitter = new vscode.EventEmitter<ViewStateChangeEvent>();
    /**
     * Event emitted when the view state of a webview panel changes.
     * This event is fired when the active webview panel changes or when a new client is registered.
     */
    readonly onDidViewStateChange = this.onDidViewStateChangeEmitter.event;

    protected readonly onDidDisposeEmitter = new vscode.EventEmitter<GlspVscodeClient>();
    /**
     * Event emitted when a client is disposed.
     * This event is fired when the webview panel is closed.
     */
    readonly onDidDispose = this.onDidDisposeEmitter.event;

    protected readonly onNoConnectionEmitter = new vscode.EventEmitter<void>();
    /**
     * Event emitted when there is no connection to any client.
     * This event is fired when all webview panels are closed.
     */
    readonly onNoConnection = this.onNoConnectionEmitter.event;

    protected readonly toDispose = new DisposableCollection();

    /**
     * Returns the active client.
     * The active client is the one whose webview panel is currently active/focus.
     */
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

    /**
     * Registers a GLSP client and sets up event listeners for its webview panel.
     * This method is called when a new client is registered with the connector.
     */
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
