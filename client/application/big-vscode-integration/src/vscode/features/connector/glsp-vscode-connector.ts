/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import {
    type Action,
    ActionMessage,
    type Args,
    Disposable,
    type GlspVscodeClient,
    GlspVscodeConnector,
    type GlspVscodeServer,
    MessageOrigin,
    type MessageProcessingResult,
    RedoAction,
    type SetDirtyStateAction,
    UndoAction
} from '@eclipse-glsp/vscode-integration';
import { inject, injectable } from 'inversify';
import * as vscode from 'vscode';
import { VscodeAction } from '../../../common/vscode.action.js';
import { TYPES } from '../../vscode-common.types.js';

/**
 * The `Connector` acts as the bridge between GLSP-Clients and the GLSP-Server
 * and is at the core of the Glsp-VSCode integration.
 *
 * It works by being providing a server that implements the `GlspVscodeServer`
 * interface and registering clients using the `GlspVscodeConnector.registerClient`
 * function. Messages sent between the clients and the server are then intercepted
 * by the connector to provide functionality based on the content of the messages.
 *
 * Messages can be intercepted using the interceptor properties in the options
 * argument.
 *
 * Please use the respective wrappers instead of using this class directly.
 */
@injectable()
export class BIGGLSPVSCodeConnector<
    TDocument extends vscode.CustomDocument = vscode.CustomDocument
> extends GlspVscodeConnector<TDocument> {
    get documents(): TDocument[] {
        return Array.from(this.documentMap.keys());
    }

    get clients(): GlspVscodeClient<TDocument>[] {
        return Array.from(this.clientMap.values());
    }

    get activeClient(): GlspVscodeClient<TDocument> | undefined {
        return this.clients.find(c => c.webviewEndpoint.webviewPanel.active);
    }

    protected readonly onDidRegisterEmitter = new vscode.EventEmitter<GlspVscodeClient<TDocument>>();
    readonly onDidRegister = this.onDidRegisterEmitter.event;
    protected readonly onDidDisposeEmitter = new vscode.EventEmitter<GlspVscodeClient<TDocument>>();
    readonly onDidDispose = this.onDidDisposeEmitter.event;

    protected readonly onServerActionMessageEmitter = new vscode.EventEmitter<ActionMessage>();
    readonly onServerActionMessage = this.onServerActionMessageEmitter.event;
    protected readonly onClientActionMessageEmitter = new vscode.EventEmitter<ActionMessage>();
    readonly onClientActionMessage = this.onClientActionMessageEmitter.event;
    protected readonly onVSCodeActionMessageEmitter = new vscode.EventEmitter<ActionMessage>();
    readonly onVSCodeActionMessage = this.onVSCodeActionMessageEmitter.event;

    /**
     * Set of actions that are handled by vscode and should not be propagated to the server.
     * This is a workaround till the java server has been replaced by a node server.
     */
    protected readonly vscodeHandledActions = new Set<string>();

    constructor(@inject(TYPES.GLSPServer) glspServer: GlspVscodeServer) {
        super({
            server: glspServer,
            logging: false,
            onBeforeReceiveMessageFromServer: (message, callback) => {
                if (ActionMessage.is(message)) {
                    this.onServerActionMessageEmitter.fire(message);
                }
                callback(message);
            },
            onBeforeReceiveMessageFromClient: (message, callback) => {
                if (ActionMessage.is(message)) {
                    this.onClientActionMessageEmitter.fire(message);
                }
                callback(message);
            },
            onBeforePropagateMessageToClient: (_originalMessage, processedMessage, _messageChanged) => {
                return processedMessage;
            },
            onBeforePropagateMessageToServer: (_originalMessage, processedMessage, _messageChanged) => {
                return processedMessage;
            }
        });
    }

    registerVscodeHandledAction(actionKind: string): Disposable {
        this.vscodeHandledActions.add(actionKind);
        return Disposable.create(() => {
            this.vscodeHandledActions.delete(actionKind);
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
        this.clientMap.set(client.clientId, client);
        this.documentMap.set(client.document, client.clientId);

        // Cleanup when client panel is closed
        const panelOnDisposeListener = client.webviewEndpoint.webviewPanel.onDidDispose(async () => {
            this.onClientDispose(client, toDispose);
            panelOnDisposeListener.dispose();
        });

        toDispose.push(
            client.webviewEndpoint.onActionMessage(message => {
                this.onClientMessage(client, message);
            })
        );

        this.onDidRegisterEmitter.fire(client);

        // Initialize glsp client
        const glspClient = await this.options.server.glspClient;
        toDispose.push(client.webviewEndpoint.initialize(glspClient));
        toDispose.unshift(
            Disposable.create(() =>
                glspClient.disposeClientSession({ clientSessionId: client.clientId, args: this.disposeClientSessionArgs(client) })
            )
        );
    }

    public sendActionToActiveServer(action: Action): void {
        this.clientMap.forEach(client => {
            if (client.webviewEndpoint.webviewPanel.active) {
                const message = {
                    clientId: client.clientId,
                    action: action
                };
                client.webviewEndpoint.sendMessage(message);
            }
        });
    }

    public sendActionToServer(clientId: string, action: Action): void {
        this.options.server.onSendToServerEmitter.fire({
            clientId,
            action
        });
    }

    protected override sendMessageToClient(clientId: string, message: unknown): void {
        const client = this.clientMap.get(clientId);
        if (client && ActionMessage.is(message)) {
            client.webviewEndpoint.sendMessage(message);
        }
    }

    override dispatchAction(action: Action, clientId?: string): void {
        const client = clientId ? this.clientMap.get(clientId) : this.getActiveClient();
        if (!client) {
            console.warn('Could not dispatch action: No client found for clientId or no active client found.', action);
            return;
        }
        const message = { clientId: client.clientId, action };
        let dispatched = false;
        if (client.webviewEndpoint.clientActions?.includes(action.kind)) {
            client.webviewEndpoint.sendMessage(message);
            dispatched = true;
        }
        if (client.webviewEndpoint.serverActions?.includes(action.kind)) {
            this.options.server.onSendToServerEmitter.fire(message);
            dispatched = true;
        }

        if (!dispatched && this.vscodeHandledActions.has(action.kind)) {
            this.onVSCodeActionMessageEmitter.fire(message);
        } else if (!dispatched) {
            console.warn('Could not dispatch action. No handler found for action kind:', action.kind);
        }
    }

    protected override handleSetDirtyStateAction(
        message: ActionMessage<SetDirtyStateAction>,
        client: GlspVscodeClient<TDocument> | undefined,
        _origin: MessageOrigin
    ): MessageProcessingResult {
        super.handleSetDirtyStateAction(message, client, _origin);
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

    protected onClientMessage(_client: GlspVscodeClient<TDocument>, message: unknown): void {
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
        const processed = super.processMessage(message, origin);

        if (processed.messageChanged) {
            return processed;
        }

        if (
            ActionMessage.is(message) &&
            (VscodeAction.isExtensionOnly(message.action) || this.vscodeHandledActions.has(message.action.kind))
        ) {
            return {
                processedMessage: undefined,
                messageChanged: true
            };
        }

        return { processedMessage: message, messageChanged: false };
    }

    protected onClientDispose(client: GlspVscodeClient<TDocument>, disposables: vscode.Disposable[]): void {
        disposables.forEach(disposable => disposable.dispose());
        this.onDidDisposeEmitter.fire(client);
    }

    protected disposeClientSessionArgs(client: GlspVscodeClient<TDocument>): Args | undefined {
        return {
            ['sourceUri']: client.document.uri.path
        };
    }
}
