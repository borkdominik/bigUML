/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { Action, ActionMessage } from '@eclipse-glsp/client';
import { ActionMessageNotification, GlspVscodeClient } from '@eclipse-glsp/vscode-integration';
import { inject, injectable, postConstruct } from 'inversify';
import * as vscode from 'vscode';
import { Messenger } from 'vscode-messenger';
import { MessageParticipant } from 'vscode-messenger-common';
import { TYPES } from '../../di.types';
import { UMLGLSPConnector } from '../../glsp/uml-glsp-connector';
import type { ProviderWebviewContext } from './webview-provider';

/**
 * Connection for the UML webview extension.
 *
 * This connection is between the webview provider and the extension host itself.
 */
@injectable()
export class UMLWebviewExtensionHostConnection {
    @inject(TYPES.Connector)
    protected readonly connector: UMLGLSPConnector;

    protected onDidClientViewStateChangeEmitter = new vscode.EventEmitter<void>();
    readonly onDidClientViewStateChange = this.onDidClientViewStateChangeEmitter.event;
    protected onDidClientDisposeEmitter = new vscode.EventEmitter<void>();
    readonly onDidClientDispose = this.onDidClientDisposeEmitter.event;
    protected onDidActiveClientChangeEmitter = new vscode.EventEmitter<GlspVscodeClient<vscode.CustomDocument>>();
    readonly onDidActiveClientChange = this.onDidActiveClientChangeEmitter.event;

    protected onNoActiveClientEmitter = new vscode.EventEmitter<void>();
    readonly onNoActiveClient = this.onNoActiveClientEmitter.event;
    protected onActionMessageEmitter = new vscode.EventEmitter<ActionMessage>();
    readonly onActionMessage = this.onActionMessageEmitter.event;
    protected onCachedActionMessageEmitter = new vscode.EventEmitter<ActionMessage>();
    readonly onCachedActionMessage = this.onCachedActionMessageEmitter.event;

    protected actionKindsToCache: string[] = [];
    protected cachedActions: Record<string, ActionMessage> = {};
    protected _webviewViewConnection?: UMLWebviewViewConnection;

    protected get webviewViewConnection(): UMLWebviewViewConnection {
        if (this._webviewViewConnection === undefined) {
            throw new Error('Webview view connection not set');
        }

        return this._webviewViewConnection;
    }

    @postConstruct()
    protected init(): void {
        this.connector.onActionMessage(msg => {
            if (this.actionKindsToCache.some(kind => kind === msg.action.kind)) {
                this.cachedActions[msg.action.kind] = msg;
                this.onCachedActionMessageEmitter.fire(msg);
            }
        });
    }

    cacheActions(kinds: string[]): void {
        this.cachedActions = {};
        this.actionKindsToCache = kinds;
    }

    getCachedAction<T extends Action>(kind: string): ActionMessage<T> | undefined {
        return this.cachedActions[kind] as ActionMessage<T> | undefined;
    }

    forwardCachedActionsToWebview(): void {
        for (const kind of Object.keys(this.cachedActions)) {
            this.webviewViewConnection.send(this.cachedActions[kind].action);
        }
    }

    /**
     * Listens for messages from the extension host.
     *
     * Direction: Extension host -> Webview provider
     */
    listen(context: ProviderWebviewContext, webviewViewConnection: UMLWebviewViewConnection, options?: { forwardCache: boolean }): void {
        this._webviewViewConnection = webviewViewConnection;

        this.connector.onDidClientViewStateChange(() => this.onDidClientViewStateChangeEmitter.fire());
        this.connector.onDidClientDispose(() => this.onDidClientDisposeEmitter.fire());
        this.connector.onDidActiveClientChange(client => this.onDidActiveClientChangeEmitter.fire(client));
        this.connector.onActionMessage(msg => this.onActionMessageEmitter.fire(msg));

        this.connector.onDidClientViewStateChange(() => {
            if (this.connector.clients.every(c => !c.webviewEndpoint.webviewPanel.active)) {
                this.onNoActiveClientEmitter.fire();
            }
        });
        this.connector.onDidClientDispose(() => {
            if (this.connector.documents.length === 0) {
                this.onNoActiveClientEmitter.fire();
            }
        });

        if (options?.forwardCache) {
            this.onCachedActionMessage(message => {
                this.webviewViewConnection.send(message.action);
            });
            this.onDidClientViewStateChange(() => {
                if (this.connector.clients.some(c => c.webviewEndpoint.webviewPanel.active)) {
                    this.forwardCachedActionsToWebview();
                }
            });
            this.webviewViewConnection.onDidChangeVisibility(webviewView => {
                if (webviewView?.visible) {
                    this.forwardCachedActionsToWebview();
                }
            });
        }
    }

    /**
     * Sends an action to the extension host.
     *
     * Direction: Webview provider -> Extension host
     */
    send(action: Action): void {
        this.connector.sendActionToActiveClient(action);
    }

    /**
     * Sends an action to the extension host.
     *
     * Direction: Webview provider -> Extension host
     */
    sendTo(clientId: string, action: Action): void {
        this.connector.sendActionToClient(clientId, action);
    }
}

/**
 * Connection for the UML webview view.
 *
 * This connection is between the webview provider and the webview view itself.
 */
@injectable()
export class UMLWebviewViewConnection {
    @inject(TYPES.Connector)
    protected readonly connector: UMLGLSPConnector;

    protected messageParticipant?: MessageParticipant;

    protected get messenger(): Messenger {
        return this.connector.messenger;
    }

    protected onActionMessageEmitter = new vscode.EventEmitter<ActionMessage>();
    readonly onActionMessage = this.onActionMessageEmitter.event;
    protected onDidChangeVisibilityEmitter = new vscode.EventEmitter<vscode.WebviewView>();
    readonly onDidChangeVisibility = this.onDidChangeVisibilityEmitter.event;

    /**
     * Listens for messages from the webview view.
     *
     * Direction: Webview view -> Webview provider
     */
    listen(context: ProviderWebviewContext): void {
        if (this.messageParticipant !== undefined) {
            throw new Error('Webview view connection already registered');
        }

        this.messageParticipant = this.messenger.registerWebviewView(context.webviewView);
        this.messenger.onNotification(ActionMessageNotification, msg => this.onActionMessageEmitter.fire(msg), {
            sender: this.messageParticipant
        });
        context.webviewView.onDidChangeVisibility(() => this.onDidChangeVisibilityEmitter.fire(context.webviewView));
    }

    /**
     * Sends an action to the webview view.
     *
     * Direction: Webview provider -> Webview view
     */
    send(action: Action): void {
        if (this.messageParticipant === undefined) {
            return;
        }

        this.messenger.sendNotification(ActionMessageNotification, this.messageParticipant, {
            action,
            clientId: this.connector.activeClient?.clientId
        });
    }
}
