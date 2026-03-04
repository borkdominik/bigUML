/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { RequestSemanticModelAction, type SemanticModelResource } from '@borkdominik-biguml/uml-glsp-server';
import { DisposableCollection, UpdateModelAction, type Disposable } from '@eclipse-glsp/vscode-integration';
import { inject, injectable, postConstruct, preDestroy } from 'inversify';
import * as vscode from 'vscode';
import { TYPES } from '../../vscode-common.types.js';
import type { ActionDispatcher } from '../action/action-dispatcher.js';
import type { ActionListener } from '../action/action-listener.js';
import type { ConnectionManager } from '../connector/connection-manager.js';

export interface ModelStateChangeEvent {
    clientId: string;
    state: GLSPModelState;
}

export class GLSPModelState {
    constructor(protected readonly semanticRoot: Readonly<SemanticModelResource>) {}

    /**
     * Returns the semantic root of the model.
     */
    getResource(): Readonly<SemanticModelResource> {
        return this.semanticRoot;
    }
}

/**
 * EXPERIMENTAL
 *
 * This class is used to manage the model state of the GLSP server.
 * It is used to store the model state of the GLSP server and to notify the clients
 * about changes in the model state.
 *
 * It returns {@link GLSPModelState} which contains the source model and its elements.
 */
@injectable()
export class GLSPServerModelState implements Disposable {
    @inject(TYPES.ActionDispatcher)
    protected readonly actionDispatcher: ActionDispatcher;
    @inject(TYPES.ActionListener)
    protected readonly actionListener: ActionListener;
    @inject(TYPES.ConnectionManager)
    protected readonly connectionManager: ConnectionManager;

    protected readonly onDidChangeModelStateEmitter = new vscode.EventEmitter<ModelStateChangeEvent>();
    readonly onDidChangeModelState = this.onDidChangeModelStateEmitter.event;

    protected readonly modelStates: Map<string, GLSPModelState> = new Map();
    protected readonly toDispose = new DisposableCollection();

    @postConstruct()
    protected init(): void {
        this.toDispose.push(
            this.connectionManager.onDidDispose(client => {
                this.modelStates.delete(client.clientId);
            }),
            this.connectionManager.onDidActiveClientChange(async () => {
                await this.refreshModelState();
            }),
            this.actionListener.registerServerListener(async message => {
                if (UpdateModelAction.is(message.action)) {
                    await this.refreshModelState();
                }
            })
        );
    }

    @preDestroy()
    dispose(): void {
        this.toDispose.dispose();
    }

    async refreshModelState(): Promise<void> {
        const response = await this.actionDispatcher.request(RequestSemanticModelAction.create());

        const state = new GLSPModelState(response.action.resource);
        this.modelStates.set(response.clientId, state);
        this.onDidChangeModelStateEmitter.fire({ clientId: response.clientId, state });
    }

    /**
     * Returns the model state of the active client.
     * If no client is active, undefined is returned.
     */
    getModelState(): GLSPModelState | undefined {
        if (!this.connectionManager.activeClient) {
            return undefined;
        }

        return this.modelStates.get(this.connectionManager.activeClient.clientId);
    }
}
