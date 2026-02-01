/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { DisposableCollection, type Disposable, type SelectionState } from '@eclipse-glsp/vscode-integration';
import { inject, injectable, postConstruct, preDestroy } from 'inversify';
import * as vscode from 'vscode';
import { TYPES } from '../../vscode-common.types.js';
import type { ConnectionManager } from './connection-manager.js';
import type { BIGGLSPVSCodeConnector } from './glsp-vscode-connector.js';

/**
 * SelectionMessage is used to communicate selection changes for GLSP clients.
 */
export interface SelectionMessage {
    clientId: string;
    state: SelectionState;
}

/**
 * SelectionService is responsible for managing selection states of GLSP clients.
 * It listens to selection updates and view state changes to keep track of the current selection.
 * It is a wrapper around the GLSP connector to simplify the selection process.
 */
@injectable()
export class SelectionService implements Disposable {
    @inject(TYPES.GLSPVSCodeConnector)
    protected readonly connector: BIGGLSPVSCodeConnector;
    @inject(TYPES.ConnectionManager)
    protected readonly connectionManager: ConnectionManager;

    protected readonly onDidSelectionChangeEmitter = new vscode.EventEmitter<SelectionMessage>();
    /**
     * Event emitted when the selection state changes.
     * This event is fired when the selection state changes or when a new client is registered.
     */
    readonly onDidSelectionChange = this.onDidSelectionChangeEmitter.event;

    protected readonly toDispose = new DisposableCollection();
    protected readonly selectionMap = new Map<string, SelectionState>();

    /**
     * Returns the current selection state of the active client.
     */
    get selection(): SelectionState | undefined {
        const clientId = this.connectionManager.activeClient?.clientId;
        if (!clientId) {
            return undefined;
        }
        return this.selectionMap.get(clientId);
    }

    /**
     * Returns the selection state of a specific client.
     */
    getSelection(clientId: string): SelectionState | undefined {
        return this.selectionMap.get(clientId);
    }

    @preDestroy()
    dispose(): void {
        this.toDispose.dispose();
    }

    @postConstruct()
    protected init(): void {
        this.toDispose.push(
            this.connectionManager.onDidDispose(client => {
                this.selectionMap.delete(client.clientId);
            }),
            this.connectionManager.onDidViewStateChange(event => {
                let state: SelectionState = { selectedElementsIDs: [], deselectedElementsIDs: [] };
                if (event.webviewPanel.active) {
                    state = this.selectionMap.get(event.client.clientId) ?? state;
                }
                const client = event.client;

                this.onDidSelectionChangeEmitter.fire({
                    clientId: client.clientId,
                    state
                });
            }),
            this.connector.onSelectionUpdate(state => {
                if (this.connectionManager.activeClient) {
                    this.selectionMap.set(this.connectionManager.activeClient.clientId, state);
                    this.onDidSelectionChangeEmitter.fire({
                        clientId: this.connectionManager.activeClient.clientId,
                        state
                    });
                }
            })
        );
    }
}
