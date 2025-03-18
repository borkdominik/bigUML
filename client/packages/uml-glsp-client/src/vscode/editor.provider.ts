/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { TYPES, type BIGGLSPVSCodeConnector } from '@borkdominik-biguml/big-vscode-integration/vscode';
import type { ServerManager, ServerManagerStateListener } from '@borkdominik-biguml/big-vscode-integration/vscode-node';
import { WebviewEndpoint, type GLSPDiagramIdentifier, type GlspVscodeClient } from '@eclipse-glsp/vscode-integration';
import { inject, injectable, postConstruct } from 'inversify';
import * as vscode from 'vscode';
import { type ThemeIntegration } from './features/theme/theme-integration.js';
import { ErrorStageResolver } from './features/webview/error.stage.js';
import { GLSPStageResolver } from './features/webview/glsp.stage.js';
import { InitializingStageResolver } from './features/webview/initializing.webview.js';
import type { EditorStageResolver, StageContext } from './features/webview/stage.js';

export const UMLDiagramEditorSettings = Symbol('UMLDiagramEditorSettings');
export interface UMLDiagramEditorSettings {
    viewType: string;
    diagramType: string;
}

@injectable()
export class UMLDiagramEditorProvider implements vscode.CustomEditorProvider, ServerManagerStateListener {
    protected editors: {
        [key: string]: {
            client: GlspVscodeClient;
            context: StageContext;
            stage: EditorStageResolver;
        };
    } = {};

    protected viewCounter = 0;
    protected serverManagerState: ServerManager.State;

    onDidChangeCustomDocument: vscode.Event<vscode.CustomDocumentContentChangeEvent<vscode.CustomDocument>>;

    constructor(
        @inject(UMLDiagramEditorSettings) protected readonly settings: UMLDiagramEditorSettings,
        @inject(TYPES.ExtensionContext) protected readonly context: vscode.ExtensionContext,
        @inject(TYPES.Theme) protected readonly themeIntegration: ThemeIntegration,
        @inject(TYPES.GLSPVSCodeConnector) protected readonly connector: BIGGLSPVSCodeConnector
    ) {
        this.onDidChangeCustomDocument = this.connector.onDidChangeCustomDocument;
    }

    @postConstruct()
    initialize(): void {
        const disposable = vscode.window.registerCustomEditorProvider(this.settings.viewType, this, {
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
        return this.connector.revertDocument(document, this.settings.diagramType);
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
        const context: StageContext = {
            document,
            webviewPanel,
            token
        };
        const clientId = this.generateClientId();
        const client = await this.prepareGLSPClient(clientId, context);
        const webview = this.createEditorBasedOnState(context, client);

        this.editors[document.uri.toString()] = {
            client,
            context: context,
            stage: webview
        };

        context.webviewPanel.onDidDispose(() => {
            delete this.editors[context.document.uri.toString()];
        });

        await webview.resolve(context);
    }

    async serverManagerStateChanged(_manager: ServerManager, state: ServerManager.State): Promise<void> {
        this.serverManagerState = state;

        if (state.state === 'error') {
            for (const key of Object.keys(this.editors)) {
                const active = this.editors[key];
                const context = active.context;

                const webview = this.createErrorResolver(context);
                await webview.resolve(context);
                this.editors[key].stage = webview;
            }
        } else if (state.state === 'launching-server') {
            for (const key of Object.keys(this.editors)) {
                const active = this.editors[key];
                const webview = active.stage;

                if (webview instanceof InitializingStageResolver) {
                    await webview.progress(active.context, `Starting ${state.launcher.serverName}`);
                }
            }
        } else if (state.state === 'servers-launched') {
            for (const key of Object.keys(this.editors)) {
                const active = this.editors[key];
                const context = active.context;

                if (active.stage instanceof InitializingStageResolver) {
                    active.stage.finish(context);
                }

                const webview = this.createGLSPResolver(active.client);
                await webview.resolve(context);
                this.editors[key].stage = webview;
            }
        }
    }

    protected generateClientId(): string {
        return `${this.settings.diagramType}_${this.viewCounter++}`;
    }

    protected createEditorBasedOnState(context: StageContext, client: GlspVscodeClient): EditorStageResolver {
        let resolver: EditorStageResolver;

        if (this.serverManagerState.state === 'servers-launched') {
            resolver = this.createGLSPResolver(client);
        } else if (this.serverManagerState.state === 'error') {
            resolver = this.createErrorResolver(context);
        } else {
            resolver = this.createInitializingEnvironmentResolver(context);
        }

        return resolver;
    }

    protected createInitializingEnvironmentResolver(context: StageContext): InitializingStageResolver {
        const resolver = new InitializingStageResolver();
        const state = this.serverManagerState;
        if (state.state === 'launching-server') {
            resolver.progress(context, `Starting ${state.launcher.serverName}`);
        }
        return resolver;
    }

    protected createErrorResolver(context: StageContext): ErrorStageResolver {
        const resolver = new ErrorStageResolver();
        const state = this.serverManagerState;
        if (state.state === 'error') {
            resolver.error(context, state.reason, state.details);
        }
        return resolver;
    }

    protected createGLSPResolver(client: GlspVscodeClient): GLSPStageResolver {
        return new GLSPStageResolver({
            client,
            context: this.context,
            diagramType: this.settings.diagramType,
            connector: this.connector,
            themeIntegration: this.themeIntegration
        });
    }

    protected async prepareGLSPClient(clientId: string, context: StageContext): Promise<GlspVscodeClient> {
        // This is used to initialize GLSP for our diagram
        const diagramIdentifier: GLSPDiagramIdentifier = {
            diagramType: this.settings.diagramType,
            uri: EditorProvider.serializeUri(context.document.uri),
            clientId
        };

        const endpoint = new WebviewEndpoint({
            diagramIdentifier,
            messenger: this.connector.messenger,
            webviewPanel: context.webviewPanel
        });

        const client: GlspVscodeClient = {
            clientId: diagramIdentifier.clientId,
            diagramType: diagramIdentifier.diagramType,
            document: context.document,
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
