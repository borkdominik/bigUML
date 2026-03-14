/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import type { Disposable } from '@eclipse-glsp/vscode-integration';
import { injectable } from 'inversify';
import type { WebviewPanel, WebviewView } from 'vscode';
import { Messenger } from 'vscode-messenger';
import type { MessageParticipant, NotificationHandler, NotificationType } from 'vscode-messenger-common';

@injectable()
export class WebviewMessenger implements Disposable {
    protected _messenger?: Messenger;
    protected _participant?: MessageParticipant;

    get messenger(): Messenger {
        if (!this._messenger) {
            throw new Error('WebviewMessenger not yet resolved. Call resolve(webview) first.');
        }
        return this._messenger;
    }

    get participant(): MessageParticipant {
        if (!this._participant) {
            throw new Error('WebviewMessenger not yet resolved. Call resolve(webview) first.');
        }
        return this._participant;
    }

    get isResolved(): boolean {
        return this._messenger !== undefined;
    }

    resolve(webview: WebviewView | WebviewPanel): void {
        this._messenger = new Messenger();

        if (isWebviewView(webview)) {
            this._participant = this._messenger.registerWebviewView(webview);
        } else {
            this._participant = this._messenger.registerWebviewPanel(webview);
        }
    }

    reuse(messenger: Messenger, participant: MessageParticipant): void {
        this._messenger = messenger;
        this._participant = participant;
    }

    dispose(): void {
        // Messenger does not require explicit disposal
    }

    onNotification<P>(type: NotificationType<P>, handler: NotificationHandler<P>): Disposable {
        return this.messenger.onNotification(type, handler, {
            sender: this.participant
        });
    }

    sendNotification<P>(type: NotificationType<P>, payload: P): void {
        this.messenger.sendNotification(type, this.participant, payload);
    }
}

function isWebviewView(webview: WebviewView | WebviewPanel): webview is WebviewView {
    return 'onDidChangeVisibility' in webview && !('onDidChangeViewState' in webview);
}
