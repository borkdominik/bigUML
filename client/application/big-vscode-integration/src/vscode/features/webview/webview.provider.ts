/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { inject, postConstruct } from 'inversify';
import {
    Uri,
    window,
    type CancellationToken,
    type ExtensionContext,
    type Webview,
    type WebviewView,
    type WebviewViewProvider,
    type WebviewViewResolveContext
} from 'vscode';
import { TYPES } from '../../vscode-common.types.js';
import { type WebviewExtensionConnector, type WebviewViewConnector } from './glsp-webview.connector.js';

export interface BIGWebviewProviderContext {
    webviewView: WebviewView;
    context: WebviewViewResolveContext<unknown>;
    token: CancellationToken;
}

export abstract class BIGWebviewProvider implements WebviewViewProvider {
    abstract id: string;
    protected readonly retainContextWhenHidden: boolean = false;

    @inject(TYPES.ExtensionContext)
    protected readonly extensionContext: ExtensionContext;
    @inject(TYPES.WebviewExtensionConnector)
    protected readonly extensionConnector: WebviewExtensionConnector;
    @inject(TYPES.WebviewViewConnector)
    protected readonly viewConnector: WebviewViewConnector;

    protected webviewView?: WebviewView;
    protected providerContext?: BIGWebviewProviderContext;

    @postConstruct()
    protected init(): void {
        window.registerWebviewViewProvider(this.id, this, {
            webviewOptions: {
                retainContextWhenHidden: this.retainContextWhenHidden
            }
        });
    }

    resolveWebviewView(
        webviewView: WebviewView,
        context: WebviewViewResolveContext<unknown>,
        token: CancellationToken
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

    protected abstract resolveHTML(providerContext: BIGWebviewProviderContext): void;

    protected initConnection(providerContext: BIGWebviewProviderContext): void {
        this.viewConnector.listen(providerContext);
        this.extensionConnector.listen(providerContext, this.viewConnector, { forwardCache: true });
    }

    protected handleConnection(): void {
        // Per default, forward all messages from the webview to the extension host
        this.viewConnector.onActionMessage(message => {
            this.extensionConnector.send(message.action);
        });
    }
}

export function getUri(webview: Webview, extensionUri: Uri, pathList: string[]): Uri {
    return webview.asWebviewUri(Uri.joinPath(extensionUri, ...pathList));
}

export function getBundleUri(webview: Webview, extensionUri: Uri, pathList: string[]): Uri {
    return getUri(webview, extensionUri, ['webviews', ...pathList]);
}
