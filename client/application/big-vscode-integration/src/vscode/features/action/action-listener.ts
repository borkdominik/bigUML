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

@injectable()
export class ActionListener implements Disposable {
    @inject(TYPES.GLSPVSCodeConnector)
    protected readonly connector: BIGGLSPVSCodeConnector;
    @inject(TYPES.ActionDispatcher)
    protected readonly actionDispatcher: ActionDispatcher;

    protected readonly clientListeners: ((action: ActionMessage) => void)[] = [];
    protected readonly serverListeners: ((action: ActionMessage) => void)[] = [];
    protected readonly toDispose = new DisposableCollection();

    @postConstruct()
    protected init(): void {
        this.toDispose.push(
            this.connector.onClientActionMessage(message => {
                this.clientListeners.forEach(listener => listener(message));
            }),
            this.connector.onServerActionMessage(message => {
                this.serverListeners.forEach(listener => listener(message));
            })
        );
    }

    dispose(): void {
        this.toDispose.dispose();
    }

    registerListener(callback: (action: ActionMessage) => void): Disposable {
        this.clientListeners.push(callback);
        return Disposable.create(() => {
            const index = this.clientListeners.indexOf(callback);
            if (index !== -1) {
                this.clientListeners.splice(index, 1);
            }
        });
    }

    registerServerListener(callback: (action: ActionMessage) => void): Disposable {
        this.serverListeners.push(callback);
        return Disposable.create(() => {
            const index = this.serverListeners.indexOf(callback);
            if (index !== -1) {
                this.serverListeners.splice(index, 1);
            }
        });
    }

    handleRequest<TRequest extends RequestAction<ResponseAction>>(
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

    createCache(cachedActionKinds: string[]): CacheActionListener {
        return new CacheActionListener(this, cachedActionKinds);
    }
}

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

    getAction(kind: string): ActionMessage | undefined {
        return this.cache[kind];
    }

    getActions(): ActionMessage[] {
        return Object.values(this.cache);
    }

    dispose(): void {
        this.toDispose.dispose();
    }
}
