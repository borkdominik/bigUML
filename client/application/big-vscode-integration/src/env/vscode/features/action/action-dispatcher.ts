/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import {
    type Action,
    type ActionMessage,
    Deferred,
    type Disposable,
    DisposableCollection,
    RequestAction,
    ResponseAction
} from '@eclipse-glsp/vscode-integration';
import { inject, injectable, postConstruct, preDestroy } from 'inversify';
import { VscodeAction } from '../../../common/vscode.action.js';
import { TYPES } from '../../vscode-common.types.js';
import type { BIGGLSPVSCodeConnector } from '../connector/glsp-vscode-connector.js';

/**
 * Dispatches actions to the GLSP client/server and handles responses.
 * It is a wrapper around the GLSP connector to simplify the action dispatching process.
 */
@injectable()
export class ActionDispatcher implements Disposable {
    @inject(TYPES.GLSPVSCodeConnector)
    protected readonly connector: BIGGLSPVSCodeConnector;

    protected readonly requests: Map<string, Deferred<ActionMessage>> = new Map();
    protected toDispose = new DisposableCollection();

    @postConstruct()
    protected init(): void {
        this.toDispose.push(
            this.connector.onClientActionMessage(message => {
                this.onActionMessage(message);
            }),
            this.connector.onServerActionMessage(message => {
                this.onActionMessage(message);
            })
        );
    }

    protected onActionMessage(message: ActionMessage): void {
        if (ResponseAction.is(message.action)) {
            const deferred = this.requests.get(message.action.responseId);
            if (deferred) {
                this.requests.delete(message.action.responseId);
                deferred.resolve(message);
            }
        }
    }

    @preDestroy()
    dispose(): void {
        this.toDispose.dispose();
    }

    /**
     * Dispatches a request action to the GLSP client (server) and returns a promise that resolves with the response action.
     */
    request<Res extends ResponseAction>(action: RequestAction<Res>): Promise<ActionMessage<Res>> {
        if (!action.requestId || action.requestId === '') {
            action.requestId = RequestAction.generateRequestId();
        }
        action.requestId = VscodeAction.prefixRequestId(action.requestId);
        const deferred = new Deferred<ActionMessage<Res>>();
        this.requests.set(action.requestId, deferred as any);
        this.dispatch(action);
        return deferred.promise;
    }

    /**
     * Dispatches an action to the GLSP client (server).
     * This method will not wait for a response.
     */
    dispatch(action: Action | Action[]): void {
        this.dispatchToClient(undefined, action);
    }

    /**
     * Dispatches an action to a specific GLSP client (server).
     * This method will not wait for a response.
     */
    dispatchToClient(clientId: string | undefined, action: Action | Action[]): void {
        if (Array.isArray(action)) {
            action.forEach(a => this.connector.dispatchAction(a, clientId));
        } else {
            this.connector.dispatchAction(action, clientId);
        }
    }

    /**
     * Broadcasts an action to all GLSP clients (server).
     * This method will not wait for a response.
     */
    broadcast(action: Action): void {
        this.connector.clients.forEach(client => {
            client.webviewEndpoint.sendMessage({
                clientId: client.clientId,
                action: action
            });
        });
    }
}
