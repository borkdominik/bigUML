/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { OutlineTreeNode, RequestOutlineAction, SetOutlineAction } from '@borkdominik-biguml/uml-glsp/lib/features/outline';
import {
    Action,
    ActionMessage,
    Args,
    GlspVscodeClient,
    GlspVscodeConnector,
    GlspVscodeServer,
    InitializeResult,
    MessageOrigin,
    MessageProcessingResult,
    RedoAction,
    SelectAction,
    SetDirtyStateAction,
    UndoAction,
    UpdateModelAction
} from '@eclipse-glsp/vscode-integration';
import { inject, injectable } from 'inversify';
import * as vscode from 'vscode';
import { TYPES } from '../di.types';
import { VSCodeActionDispatcher } from './workaround/action-dispatcher';

@injectable()
export class UVGlspConnector<TDocument extends vscode.CustomDocument = vscode.CustomDocument> extends GlspVscodeConnector<TDocument> {
    get documents(): TDocument[] {
        return Array.from(this.documentMap.keys());
    }

    get clients(): GlspVscodeClient<TDocument>[] {
        return Array.from(this.clientMap.values());
    }

    get activeClient(): GlspVscodeClient<TDocument> | undefined {
        return this.clients.find(c => c.webviewPanel.active);
    }

    
    protected readonly onDidActiveClientChangeEmitter = new vscode.EventEmitter<GlspVscodeClient<TDocument>>();
    protected readonly onDidClientViewStateChangeEmitter = new vscode.EventEmitter<GlspVscodeClient<TDocument>>();
    protected readonly onDidClientDisposeEmitter = new vscode.EventEmitter<GlspVscodeClient<TDocument>>();
    protected readonly onOutlineChangedEmitter = new vscode.EventEmitter<OutlineTreeNode[]>();
    readonly onDidActiveClientChange = this.onDidActiveClientChangeEmitter.event;
    readonly onDidClientViewStateChange = this.onDidClientViewStateChangeEmitter.event;
    readonly onDidClientDispose = this.onDidClientDisposeEmitter.event;
    readonly onOutlineChanged = this.onOutlineChangedEmitter.event;

    constructor(
        @inject(TYPES.GlspServer) glspServer: GlspVscodeServer,
        @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher: VSCodeActionDispatcher
    ) {
        super({
            server: glspServer,
            logging: false,
            onBeforeReceiveMessageFromClient: (message, callback) => {
                callback(message, true);
                if (ActionMessage.is(message)) {
                    this.actionDispatcher.dispatch(message.action);
                }
            },
            onBeforeReceiveMessageFromServer: (message, callback) => {
                callback(message, true);
                if (ActionMessage.is(message)) {
                    this.actionDispatcher.dispatch(message.action);
                }
            }
        });
        this.actionDispatcher.connect(this);
    }

    clientIdByDocument(document: TDocument): string | undefined {
        return this.documentMap.get(document);
    }

    public override async registerClient(client: GlspVscodeClient<TDocument>): Promise<InitializeResult> {
        this.clientMap.set(client.clientId, client);
        this.documentMap.set(client.document, client.clientId);

        const clientMessageListener = client.onClientMessage(message => {
            this.onClientMessage(client, message);
        });

        const viewStateListener = client.webviewPanel.onDidChangeViewState(e => {
            this.onClientViewStateChange(client, e);
        });

        const panelOnDisposeListener = client.webviewPanel.onDidDispose(() => {
            this.onClientDispose(client, [clientMessageListener, viewStateListener, panelOnDisposeListener]);
        });

        // Initialize client session
        const glspClient = await this.options.server.glspClient;
        const initializeParams = await this.createInitializeClientSessionParams(client);
        await glspClient.initializeClientSession(initializeParams);
        return this.options.server.initializeResult;
    }

    public broadcastActionToClients(action: Action): void {
        this.clientMap.forEach(client => {
            client.onSendToClientEmitter.fire({
                clientId: client.clientId,
                action: action,
                __localDispatch: true
            });
        });
    }

    public requestSelection(action: SelectAction): void {
        this.sendActionToActiveClient(action);
    }

    public override sendActionToClient(clientId: string, action: Action): void {
        super.sendActionToClient(clientId, action);
    }

    protected requestNewOutline(): void {
        this.sendActionToActiveClient(new RequestOutlineAction());
    }

    protected override handleSetDirtyStateAction(
        message: ActionMessage<SetDirtyStateAction>,
        client: GlspVscodeClient<TDocument> | undefined,
        _origin: MessageOrigin
    ): MessageProcessingResult {
        if (client) {
            const reason = message.action.reason || '';
            if (reason === 'save') {
                this.onDocumentSavedEmitter.fire(client.document);
            } else if (message.action.isDirty && message.action.reason === 'operation') {
                this.onDidChangeCustomDocumentEventEmitter.fire({
                    document: client.document,
                    undo: () => {
                        this.sendActionToClient(client.clientId, UndoAction.create());
                    },
                    redo: () => {
                        this.sendActionToClient(client.clientId, RedoAction.create());
                    }
                });
            }
        }

        return { processedMessage: message, messageChanged: false };
        // TODO: Check why
        // The webview client cannot handle `SetDirtyStateAction`s. Avoid propagation
        // return { processedMessage: GlspVscodeConnector.NO_PROPAGATION_MESSAGE, messageChanged: true };
    }

    protected handleSetOutlineAction(
        message: ActionMessage<SetOutlineAction>,
        _client: GlspVscodeClient<TDocument> | undefined,
        _origin: MessageOrigin
    ): MessageProcessingResult {
        const nodes = message.action.outlineTreeNodes;
        this.onOutlineChangedEmitter.fire(nodes);
        return { processedMessage: message, messageChanged: false };
    }

    protected handleUpdateModelAction(
        message: ActionMessage<UpdateModelAction>,
        _client: GlspVscodeClient<TDocument> | undefined,
        _origin: MessageOrigin
    ): MessageProcessingResult {
        this.requestNewOutline();
        return { processedMessage: message, messageChanged: false };
    }

    protected onClientMessage(client: GlspVscodeClient<TDocument>, message: unknown): void {
        if (this.options.logging) {
            if (ActionMessage.is(message)) {
                console.log(`Client (${message.clientId}): ${message.action.kind}`, message.action);
            } else {
                console.log('Client (no action message):', message);
            }
        }

        // Run message through first user-provided interceptor (pre-receive)
        this.options.onBeforeReceiveMessageFromClient(message, (newMessage, shouldBeProcessedByConnector = true) => {
            const { processedMessage, messageChanged } = shouldBeProcessedByConnector
                ? this.processMessage(newMessage, MessageOrigin.CLIENT)
                : { processedMessage: message, messageChanged: false };

            const filteredMessage = this.options.onBeforePropagateMessageToServer(newMessage, processedMessage, messageChanged);

            if (typeof filteredMessage !== 'undefined') {
                this.options.server.onSendToServerEmitter.fire(filteredMessage);
            }
        });
    }

    protected override processMessage(message: unknown, origin: MessageOrigin): MessageProcessingResult {
        if (ActionMessage.is(message)) {
            const client = this.clientMap.get(message.clientId);
            if (SetOutlineAction.is(message.action)) {
                return this.handleSetOutlineAction(message as ActionMessage<SetOutlineAction>, client, origin);
            }
            if (UpdateModelAction.is(message.action)) {
                return this.handleUpdateModelAction(message as ActionMessage<UpdateModelAction>, client, origin);
            }
        }
        return super.processMessage(message, origin);
    }

    protected onClientViewStateChange(client: GlspVscodeClient<TDocument>, event: vscode.WebviewPanelOnDidChangeViewStateEvent): void {
        if (event.webviewPanel.active) {
            this.onDidActiveClientChangeEmitter.fire(client);
            this.selectionUpdateEmitter.fire(this.clientSelectionMap.get(client.clientId) || []);
            // The active document has changed. A new outline must be requested,
            // because the model by already be present on the client and thus not trigger a model update.
            this.requestNewOutline();
        }
        this.onDidClientViewStateChangeEmitter.fire(client);
    }

    protected onClientDispose(client: GlspVscodeClient<TDocument>, disposables: vscode.Disposable[]): void {
        this.diagnostics.set(client.document.uri, undefined); // this clears the diagnostics for the file
        this.clientMap.delete(client.clientId);
        this.documentMap.delete(client.document);
        this.clientSelectionMap.delete(client.clientId);

        this.options.server.glspClient.then(gc => {
            gc.disposeClientSession({
                clientSessionId: client.clientId,
                args: this.disposeClientSessionArgs(client)
            });
        });

        disposables.forEach(d => d.dispose());
        this.onDidClientDisposeEmitter.fire(client);
    }

    protected disposeClientSessionArgs(client: GlspVscodeClient<TDocument>): Args | undefined {
        return {
            ['sourceUri']: client.document.uri.path
        };
    }
}
