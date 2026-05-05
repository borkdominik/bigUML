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

/**
 * A specialized messenger that allows for the registration of multiple handlers for the same notification type.
 * This is useful when you want to have multiple components listening to the same notification type.
 *
 * @see {@link https://github.com/TypeFox/vscode-messenger}
 */
export class BigMessenger extends Messenger {
    protected readonly handlers: Map<string, (RequestHandler<unknown, unknown> | NotificationHandler<unknown>)[]> = new Map();

    /**
     * Adds a handler for the given notification type.
     * The handler will be called when a request of the given type is received.
     */
    addNotificationHandler<P>(type: NotificationType<P>, handler: NotificationHandler<P>): void {
        if (!this.handlers.has(type.method)) {
            this.handlers.set(type.method, []);
        }
        this.handlers.get(type.method)?.push(handler as NotificationHandler<unknown>);
    }

    /**
     * Removes a handler for the given request type.
     * The handler will no longer be called when a request of the given type is received.
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

    /**
     * Listens for notifications of the given type.
     * The handler will be called when a notification of the given type is received.
     *
     * This method is preferred over `addNotificationHandler` because it automatically registers the handler
     * with the messenger and returns a disposable that can be used to remove the handler.
     */
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
