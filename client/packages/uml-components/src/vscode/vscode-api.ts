/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { hasObjectProp, hasStringProp } from '@eclipse-glsp/protocol';
import { v4 } from 'uuid';

// https://github.com/estruyf/vscode-helpers

export interface VSCodeApi {
    postMessage: (message: any) => void;
}

let api: VSCodeApi | undefined;

export function getOrAcquireVSCodeApi(): VSCodeApi {
    if (api === undefined) {
        api = acquireVsCodeApi();
    }

    return api;
}

export interface ConnectionMessage<T> {
    command: string;
    payload: T;
    requestId?: string;
    clientId?: string;
    error?: any;
}

export namespace ConnectionMessage {
    export function is(message: object): message is ConnectionMessage<any> {
        return hasStringProp(message, 'clientId') && hasStringProp(message, 'command') && hasObjectProp(message, 'payload');
    }
}

export class VSCodeConnection {
    private static _instance: VSCodeConnection;
    protected listeners: { [commandId: string]: (result: any, error: any) => void } = {};

    protected readonly vscode: VSCodeApi;

    private constructor() {
        this.vscode = getOrAcquireVSCodeApi();

        this.listen((message: ConnectionMessage<any>) => {
            const { requestId, payload, error } = message;

            if (requestId && this.listeners[requestId]) {
                this.listeners[requestId](payload, error);
            }
        }, ConnectionMessage.is);
    }

    static instance(): VSCodeConnection {
        if (!VSCodeConnection._instance) {
            VSCodeConnection._instance = new VSCodeConnection();
        }

        return VSCodeConnection._instance;
    }

    listen<T>(cb: (payload: T, clientId: string, event: MessageEvent<T>) => void, assert?: (data: any) => data is T): void {
        window.addEventListener('message', (event: MessageEvent<any>) => {
            if ('payload' in event.data) {
                if (assert === undefined || assert(event.data.payload)) {
                    cb(event.data.payload, event.data.clientId, event);
                }
            } else {
                console.warn('No payload in message found', event.data);
            }
        });
    }

    post<T>(message: ConnectionMessage<T>): void {
        this.vscode.postMessage(message);
    }

    request<T>(command: string, clientId?: string, payload?: any): Promise<T> {
        const requestId = v4();

        return new Promise((resolve, reject) => {
            this.listeners[requestId] = (result: T, error: any) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }

                if (this.listeners[requestId]) {
                    delete this.listeners[requestId];
                }
            };

            this.post({
                clientId,
                command,
                requestId,
                payload
            });
        });
    }
}
