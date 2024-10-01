/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { Action, ActionMessage } from '@eclipse-glsp/client';
import { inject, postConstruct } from 'inversify';
import { ActionMessageNotification } from 'packages/uml-protocol/lib';
import * as vscode from 'vscode';
import { Messenger } from 'vscode-messenger';
import { MessageParticipant } from 'vscode-messenger-common';
import { TYPES } from '../../di.types';
import { UMLGLSPConnector } from '../../glsp/uml-glsp-connector';

export interface ProviderWebviewContext {
    webviewView: vscode.WebviewView;
    context: vscode.WebviewViewResolveContext<unknown>;
    token: vscode.CancellationToken;
}

export abstract class UMLWebviewProvider implements vscode.WebviewViewProvider {
    abstract id: string;
    protected readonly retainContextWhenHidden: boolean = false;

    @inject(TYPES.ExtensionContext)
    protected readonly extension: vscode.ExtensionContext;
    @inject(TYPES.Connector)
    protected readonly connector: UMLGLSPConnector;

    protected messenger: Messenger;
    protected messageParticipant?: MessageParticipant;
    protected webviewView?: vscode.WebviewView;
    protected providerContext?: ProviderWebviewContext;

    @postConstruct()
    initialize(): void {
        vscode.window.registerWebviewViewProvider(this.id, this, {
            webviewOptions: {
                retainContextWhenHidden: this.retainContextWhenHidden
            }
        });

        this.messenger = this.connector.messenger;
    }

    resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext<unknown>,
        token: vscode.CancellationToken
    ): void | Thenable<void> {
        this.webviewView = webviewView;
        const webview = webviewView.webview;

        this.providerContext = {
            webviewView,
            context,
            token
        };

        webview.options = {
            enableScripts: true
        };

        this.resolveHTML(this.providerContext);
        webviewView.onDidChangeVisibility(() => this.onWebviewVisiblitlyChanged());

        this.messageParticipant = this.messenger.registerWebviewView(webviewView);
        this.messenger.onNotification(
            ActionMessageNotification,
            msg => {
                this.onActionMessage(msg);
            },
            {
                sender: this.messageParticipant
            }
        );
    }

    protected abstract resolveHTML(providerContext: ProviderWebviewContext): void;

    protected onWebviewVisiblitlyChanged(): void {
        // Nothing to do
    }

    protected onActionMessage(message: ActionMessage): void {
        this.connector.sendActionToActiveClient(message.action);
    }

    protected sendActionToWebview(action: Action): void {
        if (this.messageParticipant === undefined) {
            return;
        }

        this.messenger.sendNotification(ActionMessageNotification, this.messageParticipant, {
            action,
            clientId: this.connector.activeClient?.clientId
        });
    }
}
