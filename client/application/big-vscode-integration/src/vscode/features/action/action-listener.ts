/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import type { InferResponseType } from '@borkdominik-biguml/uml-protocol';
import {
    Disposable,
    DisposableCollection,
    type ActionMessage,
    type MaybePromise,
    type RequestAction,
    type ResponseAction
} from '@eclipse-glsp/vscode-integration';
import { inject, injectable, postConstruct } from 'inversify';
import * as vscode from 'vscode';
import { TYPES } from '../../vscode-common.types.js';
import type { BIGGLSPVSCodeConnector } from '../connector/glsp-vscode-connector.js';
import type { ActionDispatcher } from './action-dispatcher.js';

/**
 * Listens for actions from the GLSP client/server and propagates them to the appropriate handlers.
 * It is a wrapper around the GLSP connector to simplify the action listening process.
 */
@injectable()
export class ActionListener implements Disposable {
    @inject(TYPES.GLSPVSCodeConnector)
    protected readonly connector: BIGGLSPVSCodeConnector;
    @inject(TYPES.ActionDispatcher)
    protected readonly actionDispatcher: ActionDispatcher;

    protected readonly clientListeners: ((action: ActionMessage) => void)[] = [];
    protected readonly serverListeners: ((action: ActionMessage) => void)[] = [];
    protected readonly vscodeListeners: ((action: ActionMessage) => void)[] = [];
    protected readonly toDispose = new DisposableCollection();

    @postConstruct()
    protected init(): void {
        this.toDispose.push(
            this.connector.onClientActionMessage(message => {
                this.clientListeners.forEach(listener => listener(message));
            }),
            this.connector.onServerActionMessage(message => {
                this.serverListeners.forEach(listener => listener(message));
            }),
            this.connector.onVSCodeActionMessage(message => {
                this.vscodeListeners.forEach(listener => listener(message));
            })
        );
    }

    dispose(): void {
        this.toDispose.dispose();
    }

    /**
     * Registers a listener for all actions from the GLSP client.
     * The listener will be called with the action message when an action is received.
     */
    registerListener(callback: (action: ActionMessage) => void): Disposable {
        this.clientListeners.push(callback);
        return Disposable.create(() => {
            const index = this.clientListeners.indexOf(callback);
            if (index !== -1) {
                this.clientListeners.splice(index, 1);
            }
        });
    }

    /**
     * Registers a listener for all actions from the GLSP server.
     * The listener will be called with the action message when an action is received.
     */
    registerServerListener(callback: (action: ActionMessage) => void): Disposable {
        this.serverListeners.push(callback);
        return Disposable.create(() => {
            const index = this.serverListeners.indexOf(callback);
            if (index !== -1) {
                this.serverListeners.splice(index, 1);
            }
        });
    }

    /**
     * Registers a listener for all actions from VSCode.
     * The listener will be called with the action message when an action is received.
     *
     * The handler will be only called when there is no other handler registered for the action within GLSP.
     * So if you have a handler registered within GLSP (either within the server or client),
     * the handler will not be called.
     */
    registerVSCodeListener(callback: (action: ActionMessage) => void): Disposable {
        this.vscodeListeners.push(callback);
        return Disposable.create(() => {
            const index = this.vscodeListeners.indexOf(callback);
            if (index !== -1) {
                this.vscodeListeners.splice(index, 1);
            }
        });
    }

    /**
     * Registers a handler for a specific request action.
     * The handler will be called with the action message when the action is received.
     * The handler should return a response action, which will be dispatched back to GLSP.
     * The request will be not further propagated.
     *
     * (This is a workaround until the GLSP server is migrated to NodeJS)
     */
    handleGLSPRequest<TRequest extends RequestAction<ResponseAction>>(
        kind: TRequest['kind'],
        handler: (action: ActionMessage<TRequest>) => MaybePromise<InferResponseType<TRequest>>
    ): Disposable {
        const toDispose = new DisposableCollection();

        toDispose.push(
            this.connector.registerVscodeHandledAction(kind),
            this.registerListener(async message => {
                if (message.action.kind === kind) {
                    const response = await handler(message as any);
                    this.actionDispatcher.dispatch(response);
                }
            })
        );

        return toDispose;
    }

    /**
     * Registers a handler for a specific request action.
     * The handler will be called with the action message when the action is received and can not be handled by GLSP.
     * The handler should return a response action, which will be dispatched back.
     * The request will be not further propagated.
     *
     * (This is a workaround until the GLSP server is migrated to NodeJS)
     */
    handleVSCodeRequest<TRequest extends RequestAction<ResponseAction>>(
        kind: TRequest['kind'],
        handler: (action: ActionMessage<TRequest>) => MaybePromise<InferResponseType<TRequest>>
    ): Disposable {
        const toDispose = new DisposableCollection();

        toDispose.push(
            this.connector.registerVscodeHandledAction(kind),
            this.registerVSCodeListener(async message => {
                if (message.action.kind === kind) {
                    const response = await handler(message as any);
                    this.actionDispatcher.dispatch(response);
                }
            })
        );

        return toDispose;
    }

    /**
     * Creates a cache for action messages of the specified kinds.
     * The cache will listen for actions from the GLSP client and store them in memory.
     * The cache can be used to retrieve the last action message of each kind.
     */
    createCache(cachedActionKinds: string[]): CacheActionListener {
        return new CacheActionListener(this, cachedActionKinds);
    }
}

/**
 * Caches action messages of the specified kinds.
 * It listens for actions from the GLSP client and stores them in memory.
 * The cache can be used to retrieve the last action message of each kind.
 */
export class CacheActionListener implements Disposable {
    protected readonly toDispose = new DisposableCollection();
    protected readonly cache: Record<string, ActionMessage> = {};

    protected onDidChangeEmitter = new vscode.EventEmitter<ActionMessage>();
    readonly onDidChange = this.onDidChangeEmitter.event;

    constructor(
        protected readonly actionListener: ActionListener,
        protected readonly cachedActionKinds: string[]
    ) {
        this.toDispose.push(
            this.actionListener.registerListener(message => {
                if (this.cachedActionKinds.includes(message.action.kind)) {
                    this.cache[message.action.kind] = message;
                    this.onDidChangeEmitter.fire(message);
                }
            })
        );
    }

    /**
     * Retrieves the last action message of the specified kind from the cache.
     */
    getAction(kind: string): ActionMessage | undefined {
        return this.cache[kind];
    }

    /**
     * Retrieves all cached action messages.
     */
    getActions(): ActionMessage[] {
        return Object.values(this.cache);
    }

    dispose(): void {
        this.toDispose.dispose();
    }
}
