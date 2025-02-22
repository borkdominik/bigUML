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

export interface SelectionMessage {
    clientId: string;
    state: SelectionState;
}

@injectable()
export class SelectionService implements Disposable {
    @inject(TYPES.GLSPVSCodeConnector)
    protected readonly connector: BIGGLSPVSCodeConnector;
    @inject(TYPES.ConnectionManager)
    protected readonly connectionManager: ConnectionManager;

    protected readonly onDidSelectionChangeEmitter = new vscode.EventEmitter<SelectionMessage>();
    readonly onDidSelectionChange = this.onDidSelectionChangeEmitter.event;

    protected readonly toDispose = new DisposableCollection();
    protected readonly selectionMap = new Map<string, SelectionState>();

    get selection(): SelectionState | undefined {
        const clientId = this.connectionManager.activeClient?.clientId;
        if (!clientId) {
            return undefined;
        }
        return this.selectionMap.get(clientId);
    }

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
