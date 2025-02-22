/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { Disposable } from '@eclipse-glsp/protocol';
import type { MessageParticipant, NotificationHandler, NotificationType, RequestHandler } from 'vscode-messenger-common';
import { Messenger, type VsCodeApi } from 'vscode-messenger-webview';

declare global {
    function acquireVsCodeApi(): VsCodeApi;
}

export const vscode = acquireVsCodeApi();

export class BigMessenger extends Messenger {
    protected readonly handlers: Map<string, (RequestHandler<unknown, unknown> | NotificationHandler<unknown>)[]> = new Map();

    /**
     * Adds a handler for a notification type.
     */
    addNotificationHandler<P>(type: NotificationType<P>, handler: NotificationHandler<P>): void {
        if (!this.handlers.has(type.method)) {
            this.handlers.set(type.method, []);
        }
        this.handlers.get(type.method)?.push(handler as NotificationHandler<unknown>);
    }

    /**
     * Removes a handler for a notification type.
     */
    removeNotificationHandler<P>(type: NotificationType<P>, handler: NotificationHandler<P>): void {
        const handlers = this.handlers.get(type.method);
        if (handlers) {
            const index = handlers.indexOf(handler as NotificationHandler<unknown>);
            if (index !== -1) {
                handlers.splice(index, 1);
            }

            if (handlers.length === 0) {
                this.handlerRegistry.delete(type.method);
            }
        }
    }

    listenNotification<P>(type: NotificationType<P>, handler: NotificationHandler<P>): Disposable {
        if (!this.handlers.has(type.method)) {
            this.handlerRegistry.set(type.method, (params, sender) => {
                this.handleOnNotification(type, params, sender);
            });
        }

        this.addNotificationHandler(type, handler);

        return Disposable.create(() => {
            this.removeNotificationHandler(type, handler);
        });
    }

    protected handleOnNotification(type: NotificationType<unknown>, params: unknown, sender: MessageParticipant): void {
        const handlers = this.handlers.get(type.method);
        if (handlers) {
            handlers.forEach(handler => handler(params, sender));
        }
    }
}

export const messenger = new BigMessenger(vscode);
