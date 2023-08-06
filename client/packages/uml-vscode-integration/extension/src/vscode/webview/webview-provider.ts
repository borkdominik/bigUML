/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { Action, hasObjectProp, hasStringProp } from '@eclipse-glsp/client';
import { GlspVscodeClient } from '@eclipse-glsp/vscode-integration';
import { inject, postConstruct } from 'inversify';
import * as vscode from 'vscode';
import { TYPES } from '../../di.types';
import { VSCodeActionDispatcher } from '../../glsp/workaround/action-dispatcher';

export interface ProviderWebviewContext {
    webviewView: vscode.WebviewView;
    context: vscode.WebviewViewResolveContext<unknown>;
    token: vscode.CancellationToken;
}

export interface ConnectionMessage<T> {
    command: string;
    payload: T;
    requestId?: string;
    clientId?: string;
    error?: any;
}

export namespace ConnectionData {
    export function is(message: object): message is ConnectionMessage<any> {
        return hasStringProp(message, 'command') && hasObjectProp(message, 'payload');
    }
}

export abstract class UVWebviewProvider implements vscode.WebviewViewProvider {
    abstract id: string;
    protected readonly retainContextWhenHidden: boolean = false;

    @inject(TYPES.ExtensionContext)
    protected readonly extension: vscode.ExtensionContext;

    @inject(TYPES.IActionDispatcher)
    protected readonly actionDispatcher: VSCodeActionDispatcher;

    protected providerContext?: ProviderWebviewContext;

    @postConstruct()
    initialize(): void {
        vscode.window.registerWebviewViewProvider(this.id, this, {
            webviewOptions: {
                retainContextWhenHidden: this.retainContextWhenHidden
            }
        });
    }

    resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext<unknown>,
        token: vscode.CancellationToken
    ): void | Thenable<void> {
        const webview = webviewView.webview;

        this.providerContext = {
            webviewView,
            context,
            token
        };

        webview.onDidReceiveMessage(this.onDidReceiveMessage.bind(this));

        webview.options = {
            enableScripts: true
        };

        this.resolveHTML(this.providerContext);
    }

    protected abstract resolveHTML(providerContext: ProviderWebviewContext): void;

    protected onDidReceiveMessage(message: any): void {
        if (ConnectionData.is(message) && message.command === 'dispatch-action') {
            this.onDidReceiveDispatchAction(message);
        }
    }

    protected onDidReceiveDispatchAction(message: ConnectionMessage<Action>): void {
        this.actionDispatcher.dispatchToActiveClient(message.payload);
    }

    protected postMessage(payload: any, client?: GlspVscodeClient): void {
        if (this.providerContext === undefined) {
            return;
        }

        this.providerContext.webviewView.webview.postMessage({
            clientId: client?.clientId,
            payload
        });
    }
}
