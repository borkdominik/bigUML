/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { GLSPDiagramIdentifier, GlspVscodeClient, WebviewEndpoint } from '@eclipse-glsp/vscode-integration';
import { inject, injectable, postConstruct } from 'inversify';
import * as vscode from 'vscode';
import { TYPES } from '../../di.types';
import { ThemeIntegration } from '../../features/theme/theme-integration';
import { UVGlspConnector } from '../../glsp/uv-glsp-connector';
import { VSCodeSettings } from '../../language';
import { ServerManager, ServerManagerStateListener } from '../../server/server.manager';
import { ErrorWebviewResolver } from './error.webview';
import { GLSPWebviewResolver } from './glsp.webview';
import { InitializingWebviewResolver } from './initializing.webview';
import { WebviewResolver, WebviewResource } from './webview';

@injectable()
export class UmlDiagramEditorProvider implements vscode.CustomEditorProvider, ServerManagerStateListener {
    diagramType = 'umldiagram';

    protected editors: {
        [key: string]: {
            client: GlspVscodeClient;
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
        const client = await this.prepareGLSPClient(clientId, resource);
        const webview = this.createEditorBasedOnState(resource, client);

        this.editors[document.uri.toString()] = {
            client,
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

        if (state.state === 'error') {
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

                const webview = this.createGLSPResolver(active.client);
                await webview.resolve(resource);
                this.editors[key].webview = webview;
            }
        }
    }

    protected generateClientId(): string {
        return `${this.diagramType}_${this.viewCounter++}`;
    }

    protected createEditorBasedOnState(resource: WebviewResource, client: GlspVscodeClient): WebviewResolver {
        let resolver: WebviewResolver;

        if (this.serverManagerState.state === 'servers-launched') {
            resolver = this.createGLSPResolver(client);
        } else if (this.serverManagerState.state === 'error') {
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
        if (state.state === 'error') {
            resolver.error(resource, state.reason, state.details);
        }
        return resolver;
    }

    protected createGLSPResolver(client: GlspVscodeClient): GLSPWebviewResolver {
        return new GLSPWebviewResolver({
            client,
            context: this.context,
            diagramType: this.diagramType,
            connector: this.connector,
            themeIntegration: this.themeIntegration
        });
    }

    protected async prepareGLSPClient(clientId: string, resource: WebviewResource): Promise<GlspVscodeClient> {
        // This is used to initialize GLSP for our diagram
        const diagramIdentifier: GLSPDiagramIdentifier = {
            diagramType: this.diagramType,
            uri: EditorProvider.serializeUri(resource.document.uri),
            clientId
        };

        const endpoint = new WebviewEndpoint({
            diagramIdentifier,
            messenger: this.connector.messenger,
            webviewPanel: resource.webviewPanel
        });

        const client: GlspVscodeClient = {
            clientId: diagramIdentifier.clientId,
            diagramType: diagramIdentifier.diagramType,
            document: resource.document,
            webviewEndpoint: endpoint
        };
        await this.connector.registerClient(client);

        return client;
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
