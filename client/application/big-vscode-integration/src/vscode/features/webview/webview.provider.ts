/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { DisposableCollection, type Disposable } from '@eclipse-glsp/vscode-integration';
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
import { EXPERIMENTAL_TYPES, TYPES } from '../../vscode-common.types.js';
import type { ActionDispatcher } from '../action/action-dispatcher.js';
import type { ActionListener } from '../action/action-listener.js';
import type { ConnectionManager } from '../connector/connection-manager.js';
import type { SelectionService } from '../connector/selection-service.js';
import type { ExperimentalGLSPServerModelState } from '../glsp/experimental/exp-server-model-state.js';
import { type WebviewViewConnector } from './glsp-webview.connector.js';
import { SetupWebviewNotification } from './webview.messages.js';

/**
 * The context of the webview provider.
 * It can be passed around to other classes.
 */
export interface BIGWebviewProviderContext {
    webviewView: WebviewView;
    context: WebviewViewResolveContext<unknown>;
    token: CancellationToken;
}

/**
 * Abstract class for webview providers.
 * It registers the webview with the VSCode extension host and handles the connection to the webview.
 */
export abstract class BIGWebviewProvider implements WebviewViewProvider, Disposable {
    abstract viewId: string;
    protected readonly retainContextWhenHidden: boolean = false;

    @inject(TYPES.ExtensionContext)
    protected readonly extensionContext: ExtensionContext;
    @inject(TYPES.WebviewViewConnector)
    protected readonly webviewConnector: WebviewViewConnector;
    @inject(EXPERIMENTAL_TYPES.GLSPServerModelState)
    protected readonly modelState: ExperimentalGLSPServerModelState;

    protected readonly toDispose = new DisposableCollection();
    protected webviewView?: WebviewView;
    protected providerContext?: BIGWebviewProviderContext;

    constructor(
        @inject(TYPES.ActionDispatcher)
        protected readonly actionDispatcher: ActionDispatcher,
        @inject(TYPES.ActionListener)
        protected readonly actionListener: ActionListener,
        @inject(TYPES.ConnectionManager)
        protected readonly connectionManager: ConnectionManager,
        @inject(TYPES.SelectionService)
        protected readonly selectionService: SelectionService
    ) {}

    @postConstruct()
    protected init(): void {
        this.toDispose.push(
            this.webviewConnector,
            window.registerWebviewViewProvider(this.viewId, this, {
                webviewOptions: {
                    retainContextWhenHidden: this.retainContextWhenHidden
                }
            })
        );
    }

    public dispose(): void {
        this.toDispose.dispose();
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
    }

    protected abstract resolveHTML(providerContext: BIGWebviewProviderContext): void;

    protected initConnection(providerContext: BIGWebviewProviderContext): void {
        this.webviewConnector.listen(providerContext);

        this.handleConnection();
    }

    protected handleConnection(): void {
        // Per default, forward all messages from the webview to the extension host
        this.toDispose.push(
            this.webviewConnector.onReady(() => {
                this.webviewConnector.sendNotification(SetupWebviewNotification, {
                    clientId: this.connectionManager.activeClient?.clientId
                });
            }),
            this.connectionManager.onDidActiveClientChange(client => {
                this.webviewConnector.sendNotification(SetupWebviewNotification, {
                    clientId: client.clientId
                });
            }),
            this.webviewConnector.onActionMessage(message => {
                this.actionDispatcher.dispatch(message.action);
            })
        );
    }
}

export function getUri(webview: Webview, extensionUri: Uri, pathList: string[]): Uri {
    return webview.asWebviewUri(Uri.joinPath(extensionUri, ...pathList));
}

export function getBundleUri(webview: Webview, extensionUri: Uri, pathList: string[]): Uri {
    return getUri(webview, extensionUri, ['webviews', ...pathList]);
}
