/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import {
    Action,
    ActionMessage,
    Args,
    Disposable,
    GlspVscodeClient,
    GlspVscodeConnector,
    GlspVscodeServer,
    MessageOrigin,
    MessageProcessingResult,
    RedoAction,
    SetDirtyStateAction,
    UndoAction
} from '@eclipse-glsp/vscode-integration';
import { inject, injectable } from 'inversify';
import * as vscode from 'vscode';
import { TYPES } from '../di.types';
import { IDEServerClientId } from './ide-server';

@injectable()
export class UMLGLSPConnector<TDocument extends vscode.CustomDocument = vscode.CustomDocument> extends GlspVscodeConnector<TDocument> {
    get documents(): TDocument[] {
        return Array.from(this.documentMap.keys());
    }

    get clients(): GlspVscodeClient<TDocument>[] {
        return Array.from(this.clientMap.values());
    }

    get activeClient(): GlspVscodeClient<TDocument> | undefined {
        return this.clients.find(c => c.webviewEndpoint.webviewPanel.active);
    }

    protected readonly onDidActiveClientChangeEmitter = new vscode.EventEmitter<GlspVscodeClient<TDocument>>();
    protected readonly onDidClientViewStateChangeEmitter = new vscode.EventEmitter<GlspVscodeClient<TDocument>>();
    protected readonly onDidClientDisposeEmitter = new vscode.EventEmitter<GlspVscodeClient<TDocument>>();
    protected readonly onActionMessageEmitter = new vscode.EventEmitter<ActionMessage>();

    readonly onDidActiveClientChange = this.onDidActiveClientChangeEmitter.event;
    readonly onDidClientViewStateChange = this.onDidClientViewStateChangeEmitter.event;
    readonly onDidClientDispose = this.onDidClientDisposeEmitter.event;
    readonly onActionMessage = this.onActionMessageEmitter.event;

    constructor(@inject(TYPES.GlspServer) glspServer: GlspVscodeServer) {
        super({
            server: glspServer,
            logging: false,
            onBeforePropagateMessageToServer: (_originalMessage, processedMessage, _messageChanged) => {
                if (ActionMessage.is(processedMessage) && (processedMessage as any).__localDispatch === true) {
                    return undefined;
                }

                return processedMessage;
            }
        });
    }

    clientIdByDocument(document: TDocument): string | undefined {
        return this.documentMap.get(document);
    }

    public override async registerClient(client: GlspVscodeClient<TDocument>): Promise<void> {
        const toDispose: Disposable[] = [
            Disposable.create(() => {
                this.diagnostics.set(client.document.uri, undefined); // this clears the diagnostics for the file
                this.clientMap.delete(client.clientId);
                this.documentMap.delete(client.document);
                this.clientSelectionMap.delete(client.clientId);
            })
        ];
        // Cleanup when client panel is closed
        const panelOnDisposeListener = client.webviewEndpoint.webviewPanel.onDidDispose(async () => {
            this.onClientDispose(client, toDispose);
            panelOnDisposeListener.dispose();
        });

        this.clientMap.set(client.clientId, client);
        this.documentMap.set(client.document, client.clientId);

        toDispose.push(
            client.webviewEndpoint.onActionMessage(message => {
                this.onClientMessage(client, message);
            })
        );

        toDispose.push(
            client.webviewEndpoint.webviewPanel.onDidChangeViewState(e => {
                this.onClientViewStateChange(client, e);
            })
        );

        // Initialize glsp client
        const glspClient = await this.options.server.glspClient;
        toDispose.push(client.webviewEndpoint.initialize(glspClient));
        toDispose.unshift(
            Disposable.create(() =>
                glspClient.disposeClientSession({ clientSessionId: client.clientId, args: this.disposeClientSessionArgs(client) })
            )
        );

        client.webviewEndpoint.ready.then(() => {
            if (client.webviewEndpoint.webviewPanel.active) {
                this.onDidActiveClientChangeEmitter.fire(client);
                this.onDidClientViewStateChangeEmitter.fire(client);
            }
        });
    }

    public broadcastActionToClients(action: Action): void {
        this.clientMap.forEach(client => {
            client.webviewEndpoint.sendMessage({
                clientId: client.clientId,
                action: action
            });
        });
    }

    public override sendActionToActiveClient(action: Action): void;
    public override sendActionToActiveClient(action: Action[]): void;
    public override sendActionToActiveClient(action: Action | Action[]): void {
        if (Array.isArray(action)) {
            action.forEach(a => super.sendActionToActiveClient(a));
        } else {
            super.sendActionToActiveClient(action);
        }
    }

    public override sendActionToClient(clientId: string, action: Action): void {
        super.sendActionToClient(clientId, action);
    }

    protected override sendMessageToClient(clientId: string, message: unknown): void {
        const client = this.clientMap.get(clientId);
        if (client && ActionMessage.is(message)) {
            client.webviewEndpoint.sendMessage(message);
        } else if (clientId !== IDEServerClientId) {
            console.info('Message has been ignored and not send to client', client, message);
        }
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
            this.onActionMessageEmitter.fire(message);
        }

        return super.processMessage(message, origin);
    }

    protected onClientViewStateChange(client: GlspVscodeClient<TDocument>, event: vscode.WebviewPanelOnDidChangeViewStateEvent): void {
        if (event.webviewPanel.active) {
            this.onDidActiveClientChangeEmitter.fire(client);
            this.selectionUpdateEmitter.fire(
                this.clientSelectionMap.get(client.clientId) || { selectedElementsIDs: [], deselectedElementsIDs: [] }
            );
        }
        this.onDidClientViewStateChangeEmitter.fire(client);
    }

    protected onClientDispose(client: GlspVscodeClient<TDocument>, disposables: vscode.Disposable[]): void {
        disposables.forEach(disposable => disposable.dispose());
        this.onDidClientDisposeEmitter.fire(client);
    }

    protected disposeClientSessionArgs(client: GlspVscodeClient<TDocument>): Args | undefined {
        return {
            ['sourceUri']: client.document.uri.path
        };
    }
}
