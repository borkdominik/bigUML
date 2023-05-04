/********************************************************************************
 * Copyright (c) 2021-2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.01
 ********************************************************************************/
import { ActionMessage, GLSPDiagramIdentifier } from '@eclipse-glsp/vscode-integration';
import { inject, injectable, postConstruct } from 'inversify';
import { isWebviewReadyMessage } from 'sprotty-vscode-protocol';
import * as vscode from 'vscode';
import { TYPES } from '../../di.types';
import { ThemeIntegration } from '../../features/theme/theme-integration';
import { UVGlspConnector } from '../../glsp/uv-glsp-connector';
import { VSCodeSettings } from '../../language';
import { ServerManager, ServerManagerStateListener } from '../../server/server.manager';
import { ErrorWebviewResolver } from './error.webview';
import { GLSPWebviewResolver } from './glsp.webiew';
import { InitializingWebviewResolver } from './initializing.webview';
import { WebviewResolver, WebviewResource } from './webview';

@injectable()
export class UmlDiagramEditorProvider implements vscode.CustomEditorProvider, ServerManagerStateListener {
    diagramType = 'umldiagram';

    protected editors: {
        [key: string]: {
            clientId: string;
            clientReady: Promise<void>;
            resource: WebviewResource;
            webview: WebviewResolver;
        };
    } = {};

    protected viewCounter = 0;
    protected serverManagerState: ServerManager.State;

    onDidChangeCustomDocument: vscode.Event<vscode.CustomDocumentContentChangeEvent<vscode.CustomDocument>>;

    constructor(
        @inject(TYPES.ExtensionContext) protected readonly context: vscode.ExtensionContext,
        @inject(TYPES.Theme) protected readonly themeIntegration: ThemeIntegration,
        @inject(TYPES.Connector) protected readonly connector: UVGlspConnector
    ) {
        this.onDidChangeCustomDocument = this.connector.onDidChangeCustomDocument;
    }

    @postConstruct()
    initialize(): void {
        const disposable = vscode.window.registerCustomEditorProvider(VSCodeSettings.editor.viewType, this, {
            webviewOptions: { retainContextWhenHidden: true },
            supportsMultipleEditorsPerDocument: false
        });
        this.context.subscriptions.push(disposable);
    }

    saveCustomDocument(document: vscode.CustomDocument, _cancellation: vscode.CancellationToken): Thenable<void> {
        return this.connector.saveDocument(document);
    }

    saveCustomDocumentAs(
        document: vscode.CustomDocument,
        destination: vscode.Uri,
        _cancellation: vscode.CancellationToken
    ): Thenable<void> {
        return this.connector.saveDocument(document, destination);
    }

    revertCustomDocument(document: vscode.CustomDocument, _cancellation: vscode.CancellationToken): Thenable<void> {
        return this.connector.revertDocument(document, this.diagramType);
    }

    backupCustomDocument(
        _document: vscode.CustomDocument,
        context: vscode.CustomDocumentBackupContext,
        _cancellation: vscode.CancellationToken
    ): Thenable<vscode.CustomDocumentBackup> {
        // Basically do the bare minimum - which is nothing
        return Promise.resolve({ id: context.destination.toString(), delete: () => undefined });
    }

    openCustomDocument(
        uri: vscode.Uri,
        _openContext: vscode.CustomDocumentOpenContext,
        _token: vscode.CancellationToken
    ): vscode.CustomDocument | Thenable<vscode.CustomDocument> {
        // Return the most basic implementation possible.
        return { uri, dispose: () => undefined };
    }

    async resolveCustomEditor(
        document: vscode.CustomDocument,
        webviewPanel: vscode.WebviewPanel,
        token: vscode.CancellationToken
    ): Promise<void> {
        const resource: WebviewResource = {
            document,
            webviewPanel,
            token
        };
        const clientId = this.generateClientId();
        const clientReady = this.prepareGLSP(clientId, resource);
        const webview = this.createEditorBasedOnState(resource, clientId, clientReady);

        this.editors[document.uri.toString()] = {
            clientId,
            clientReady,
            resource,
            webview
        };

        resource.webviewPanel.onDidDispose(() => {
            delete this.editors[resource.document.uri.toString()];
        });

        await webview.resolve(resource);
    }

    async serverManagerStateChanged(_manager: ServerManager, state: ServerManager.State): Promise<void> {
        this.serverManagerState = state;

        if (state.state === 'assertion-failed') {
            for (const key of Object.keys(this.editors)) {
                const active = this.editors[key];
                const resource = active.resource;

                const webview = this.createErrorResolver(resource);
                await webview.resolve(resource);
                this.editors[key].webview = webview;
            }
        } else if (state.state === 'launching-server') {
            for (const key of Object.keys(this.editors)) {
                const active = this.editors[key];
                const webview = active.webview;

                if (webview instanceof InitializingWebviewResolver) {
                    await webview.progress(active.resource, `Starting ${state.launcher.serverName}`);
                }
            }
        } else if (state.state === 'servers-launched') {
            for (const key of Object.keys(this.editors)) {
                const active = this.editors[key];
                const resource = active.resource;

                if (active.webview instanceof InitializingWebviewResolver) {
                    active.webview.finish(resource);
                }

                const webview = this.createGLSPResolver(active.clientId, active.clientReady);
                await webview.resolve(resource);
                this.editors[key].webview = webview;
            }
        }
    }

    protected generateClientId(): string {
        return `${this.diagramType}_${this.viewCounter++}`;
    }

    protected createEditorBasedOnState(resource: WebviewResource, clientId: string, clientReady: Promise<void>): WebviewResolver {
        let resolver: WebviewResolver;

        if (this.serverManagerState.state === 'servers-launched') {
            resolver = this.createGLSPResolver(clientId, clientReady);
        } else if (this.serverManagerState.state === 'assertion-failed') {
            resolver = this.createErrorResolver(resource);
        } else {
            resolver = this.createInitializingEnvironmentResolver(resource);
        }

        return resolver;
    }

    protected createInitializingEnvironmentResolver(resource: WebviewResource): InitializingWebviewResolver {
        const resolver = new InitializingWebviewResolver();
        const state = this.serverManagerState;
        if (state.state === 'launching-server') {
            resolver.progress(resource, `Starting ${state.launcher.serverName}`);
        }
        return resolver;
    }

    protected createErrorResolver(resource: WebviewResource): ErrorWebviewResolver {
        const resolver = new ErrorWebviewResolver();
        const state = this.serverManagerState;
        if (state.state === 'assertion-failed') {
            resolver.error(resource, state.reason, state.details);
        }
        return resolver;
    }

    protected createGLSPResolver(clientId: string, clientReady: Promise<void>): GLSPWebviewResolver {
        return new GLSPWebviewResolver({
            clientId,
            clientReady,
            context: this.context,
            diagramType: this.diagramType,
            connector: this.connector,
            themeIntegration: this.themeIntegration
        });
    }

    protected async prepareGLSP(clientId: string, resource: WebviewResource): Promise<void> {
        // This is used to initialize GLSP for our diagram
        const diagramIdentifier: GLSPDiagramIdentifier = {
            diagramType: this.diagramType,
            uri: EditorProvider.serializeUri(resource.document.uri),
            clientId
        };

        // Promise that resolves when sprotty sends its ready-message
        const clientReady = new Promise<void>(resolve => {
            const messageListener = resource.webviewPanel.webview.onDidReceiveMessage((message: unknown) => {
                if (isWebviewReadyMessage(message)) {
                    resolve();
                    messageListener.dispose();
                }
            });
        });

        const sendMessageToWebview = async (message: unknown): Promise<void> => {
            clientReady.then(() => {
                if (resource.webviewPanel.active) {
                    resource.webviewPanel.webview.postMessage(message);
                } else {
                    console.log('Message stalled for webview:', resource.document.uri.path, message);
                    const viewStateListener = resource.webviewPanel.onDidChangeViewState(() => {
                        viewStateListener.dispose();
                        sendMessageToWebview(message);
                    });
                }
            });
        };

        const receiveMessageFromServerEmitter = new vscode.EventEmitter<unknown>();
        const sendMessageToServerEmitter = new vscode.EventEmitter<unknown>();

        resource.webviewPanel.onDidDispose(() => {
            receiveMessageFromServerEmitter.dispose();
            sendMessageToServerEmitter.dispose();
        });

        // Listen for Messages from webview (only after ready-message has been received)
        clientReady.then(() => {
            resource.webviewPanel.webview.onDidReceiveMessage((message: unknown) => {
                if (ActionMessage.is(message)) {
                    sendMessageToServerEmitter.fire(message);
                }
            });
        });

        // Listen for Messages from server
        receiveMessageFromServerEmitter.event(message => {
            if (ActionMessage.is(message)) {
                sendMessageToWebview(message);
            }
        });

        // Register document/diagram panel/model in vscode connector
        const initializeResult = await this.connector.registerClient({
            clientId: diagramIdentifier.clientId,
            diagramType: diagramIdentifier.diagramType,
            document: resource.document,
            webviewPanel: resource.webviewPanel,
            onClientMessage: sendMessageToServerEmitter.event,
            onSendToClientEmitter: receiveMessageFromServerEmitter
        });

        diagramIdentifier.initializeResult = initializeResult;
        // Initialize diagram
        sendMessageToWebview(diagramIdentifier);

        return clientReady;
    }
}

export namespace EditorProvider {
    export function serializeUri(uri: vscode.Uri): string {
        let uriString = uri.toString();
        const match = uriString.match(/file:\/\/\/([a-z])%3A/i);
        if (match) {
            uriString = 'file:///' + match[1] + ':' + uriString.substring(match[0].length);
        }
        return uriString;
    }
}
