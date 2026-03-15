/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { Action, type ActionMessage } from '@eclipse-glsp/protocol';
import { DisposableCollection, type Disposable } from '@eclipse-glsp/vscode-integration';
import { inject, injectable } from 'inversify';
import * as vscode from 'vscode';
import type { NotificationType } from 'vscode-messenger-common';
import { ActionWebviewProtocol } from '../../../../common/index.js';
import { TYPES } from '../../../vscode-common.types.js';
import type { BigGlspVSCodeConnector } from '../../connector/glsp-vscode-connector.js';
import { type WebviewMessenger } from './webview-messenger.js';

@injectable()
export class ActionWebviewMessenger implements Disposable {
    protected readonly toDispose = new DisposableCollection();

    protected readonly onActionMessageEmitter = new vscode.EventEmitter<ActionMessage>();
    readonly onActionMessage = this.onActionMessageEmitter.event;

    @inject(TYPES.WebviewMessenger)
    protected readonly messenger: WebviewMessenger;

    @inject(TYPES.GlspVSCodeConnector)
    protected readonly connector: BigGlspVSCodeConnector;

    resolve(): void {
        this.toDispose.push(
            this.messenger.onNotification(ActionWebviewProtocol.Message, message => this.onActionMessageEmitter.fire(message))
        );
    }

    dispose(): void {
        this.toDispose.dispose();
    }

    sendNotification<P>(type: NotificationType<P>, payload: P): void {
        this.messenger.sendNotification(type, payload);
    }

    dispatch(message: Action | ActionMessage | ActionMessage[]): void {
        if (Action.is(message)) {
            this.messenger.sendNotification(ActionWebviewProtocol.Message, {
                action: message,
                clientId: this.connector.activeClient?.clientId
            });
            return;
        }

        if (Array.isArray(message)) {
            for (const msg of message) {
                this.messenger.sendNotification(ActionWebviewProtocol.Message, msg);
            }
        } else {
            this.messenger.sendNotification(ActionWebviewProtocol.Message, message);
        }
    }
}
