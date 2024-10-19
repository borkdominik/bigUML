/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { inject, postConstruct } from 'inversify';
import * as vscode from 'vscode';
import { TYPES } from '../../di.types';
import { UMLGLSPConnector } from '../../glsp/uml-glsp-connector';
import { UMLWebviewExtensionHostConnection, UMLWebviewViewConnection } from './webview-connection';

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

    @inject(UMLWebviewExtensionHostConnection)
    protected readonly extensionHostConnection: UMLWebviewExtensionHostConnection;
    @inject(UMLWebviewViewConnection)
    protected readonly webviewViewConnection: UMLWebviewViewConnection;

    protected webviewView?: vscode.WebviewView;
    protected providerContext?: ProviderWebviewContext;

    @postConstruct()
    protected init(): void {
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

        this.initConnection(this.providerContext);
        this.handleConnection();
    }

    protected abstract resolveHTML(providerContext: ProviderWebviewContext): void;

    protected initConnection(providerContext: ProviderWebviewContext): void {
        this.webviewViewConnection.listen(providerContext);
        this.extensionHostConnection.listen(providerContext, this.webviewViewConnection, { forwardCache: true });
    }

    protected handleConnection(): void {
        // Per default, forward all messages from the webview to the extension host
        this.webviewViewConnection.onActionMessage(message => {
            this.extensionHostConnection.send(message.action);
        });
    }
}
