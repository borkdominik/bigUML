/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { Action, type ActionMessage } from '@eclipse-glsp/protocol';
import { type Disposable, DisposableCollection } from '@eclipse-glsp/vscode-integration';
import { inject, injectable } from 'inversify';
import * as vscode from 'vscode';
import { type Messenger } from 'vscode-messenger';
import { type MessageParticipant, type NotificationHandler, type NotificationType } from 'vscode-messenger-common';
import { TYPES } from '../../vscode-common.types.js';
import type { BIGGLSPVSCodeConnector } from '../connector/glsp-vscode-connector.js';
import { ActionMessageNotification, WebviewReadyNotification } from './webview.messages.js';
import type { BIGWebviewProviderContext } from './webview.provider.js';

/**
 * Connection for the UML webview view.
 *
 * This connection is between the webview provider (VSCode Extension) and the webview view itself.
 */
@injectable()
export class WebviewViewConnector implements Disposable {
    @inject(TYPES.GLSPVSCodeConnector)
    protected readonly connector: BIGGLSPVSCodeConnector;

    protected messageParticipant?: MessageParticipant;

    protected get messenger(): Messenger {
        return this.connector.messenger;
    }

    protected toDispose = new DisposableCollection();

    protected onReadyEmitter = new vscode.EventEmitter<void>();
    /**
     * Fires when the webview is ready to receive messages.
     */
    readonly onReady = this.onReadyEmitter.event;

    protected onActionMessageEmitter = new vscode.EventEmitter<ActionMessage>();
    /**
     * Fires when an action message is received from the webview.
     */
    readonly onActionMessage = this.onActionMessageEmitter.event;

    protected onDidChangeVisibilityEmitter = new vscode.EventEmitter<vscode.WebviewView>();
    /**
     * Fires when the visibility of the webview view changes.
     */
    readonly onDidChangeVisibility = this.onDidChangeVisibilityEmitter.event;

    protected onVisibleEmitter = new vscode.EventEmitter<vscode.WebviewView>();
    /**
     * Fires when the webview view becomes visible.
     */
    readonly onVisible = this.onVisibleEmitter.event;

    protected onHideEmitter = new vscode.EventEmitter<vscode.WebviewView>();
    /**
     * Fires when the webview view is hidden.
     */
    readonly onHide = this.onHideEmitter.event;

    dispose(): void {
        this.toDispose.dispose();
    }

    /**
     * Listens for messages from the webview view.
     *
     * Direction: Webview view -> VSCode Extension
     */
    listen(context: BIGWebviewProviderContext): void {
        if (this.messageParticipant !== undefined) {
            throw new Error('Webview view connection already registered');
        }

        this.messageParticipant = this.messenger.registerWebviewView(context.webviewView);
        this.toDispose.push(
            this.messenger.onNotification(ActionMessageNotification, message => this.onActionMessageEmitter.fire(message), {
                sender: this.messageParticipant
            }),
            this.messenger.onNotification(WebviewReadyNotification, () => this.onReadyEmitter.fire(), {
                sender: this.messageParticipant
            }),
            context.webviewView.onDidChangeVisibility(() => {
                this.onDidChangeVisibilityEmitter.fire(context.webviewView);
                if (context.webviewView.visible) {
                    this.onVisibleEmitter.fire(context.webviewView);
                } else {
                    this.onHideEmitter.fire(context.webviewView);
                }
            })
        );
    }

    /**
     * Register custom notification handler for the webview.
     *
     * Direction: Webview view -> VSCode Extension
     *
     * @see {@link https://github.com/TypeFox/vscode-messenger} for more information.
     */
    registerNotificationListener<P>(type: NotificationType<P>, handler: NotificationHandler<P>): vscode.Disposable {
        return this.messenger.onNotification(type, handler, {
            sender: this.messageParticipant
        });
    }

    /**
     * Sends a notification to the webview view.
     *
     * Direction: VSCode Extension -> Webview view
     *
     * @see {@link https://github.com/TypeFox/vscode-messenger} for more information.
     */
    sendNotification<P>(type: NotificationType<P>, payload: P): void {
        if (this.messageParticipant === undefined) {
            return;
        }
        this.messenger.sendNotification(type, this.messageParticipant, payload);
    }

    /**
     * Sends an action to the webview view.
     *
     * Direction: VSCode Extension -> Webview view
     */
    dispatch(message: Action | ActionMessage | ActionMessage[]): void {
        if (this.messageParticipant === undefined) {
            return;
        }

        if (Action.is(message)) {
            this.messenger.sendNotification(ActionMessageNotification, this.messageParticipant, {
                action: message,
                clientId: this.connector.activeClient?.clientId
            });
            return;
        }

        if (Array.isArray(message)) {
            for (const msg of message) {
                this.messenger.sendNotification(ActionMessageNotification, this.messageParticipant, msg);
            }
        } else {
            this.messenger.sendNotification(ActionMessageNotification, this.messageParticipant, message);
        }
    }
}
