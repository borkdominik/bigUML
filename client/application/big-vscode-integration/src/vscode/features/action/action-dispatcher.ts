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
    type RequestAction,
    ResponseAction
} from '@eclipse-glsp/vscode-integration';
import { inject, injectable, postConstruct, preDestroy } from 'inversify';
import { TYPES } from '../../vscode-common.types.js';
import type { BIGGLSPVSCodeConnector } from '../connector/glsp-vscode-connector.js';

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

    request<Res extends ResponseAction>(action: RequestAction<Res>): Promise<ActionMessage<Res>> {
        if (!action.requestId) {
            return Promise.reject(new Error('Request without requestId'));
        }
        action.requestId = `_vscode_${action.requestId}`;
        const deferred = new Deferred<ActionMessage<Res>>();
        this.requests.set(action.requestId, deferred as any);
        this.dispatch(action);
        return deferred.promise;
    }

    dispatch(action: Action | Action[]): void {
        if (Array.isArray(action)) {
            action.forEach(a => this.connector.sendActionToActiveClient(a));
        } else {
            this.connector.sendActionToActiveClient({
                ...action
            });
        }
    }

    dispatchToClient(clientId: string, action: Action | Action[]): void {
        if (Array.isArray(action)) {
            action.forEach(a => this.connector.sendActionToClient(clientId, a));
        } else {
            this.connector.sendActionToClient(clientId, action);
        }
    }

    broadcast(action: Action): void {
        this.connector.clients.forEach(client => {
            client.webviewEndpoint.sendMessage({
                clientId: client.clientId,
                action: action
            });
        });
    }
}
