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
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

import {
    ActionMessage,
    Args,
    GlspVscodeClient,
    GlspVscodeConnector,
    GlspVscodeServer,
    InitializeResult,
    MessageOrigin,
    MessageProcessingResult,
    RedoAction,
    SetDirtyStateAction,
    UndoAction
} from '@eclipse-glsp/vscode-integration';
import { inject, injectable } from 'inversify';
import * as vscode from 'vscode';
import { TYPES } from '../../di.types';

@injectable()
export class UmlGlspConnector<D extends vscode.CustomDocument = vscode.CustomDocument> extends GlspVscodeConnector<D> {
    get documents(): D[] {
        return Array.from(this.documentMap.keys());
    }

    constructor(@inject(TYPES.GlspServer) glspServer: GlspVscodeServer) {
        super({
            server: glspServer,
            logging: false
        });
    }

    clientIdByDocument(document: D): string | undefined {
        return this.documentMap.get(document);
    }

    public override async registerClient(client: GlspVscodeClient<D>): Promise<InitializeResult> {
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

    protected override handleSetDirtyStateAction(
        message: ActionMessage<SetDirtyStateAction>,
        client: GlspVscodeClient<D> | undefined,
        _origin: MessageOrigin
    ): MessageProcessingResult {
        if (client) {
            const reason = message.action.reason || '';
            if (reason === 'save') {
                this.onDocumentSavedEmitter.fire(client.document);
            } else if (message.action.isDirty) {
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

        // The webview client cannot handle `SetDirtyStateAction`s. Avoid propagation
        return { processedMessage: GlspVscodeConnector.NO_PROPAGATION_MESSAGE, messageChanged: true };
    }

    protected onClientMessage(client: GlspVscodeClient<D>, message: unknown) {
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

    protected onClientViewStateChange(client: GlspVscodeClient<D>, event: vscode.WebviewPanelOnDidChangeViewStateEvent) {
        if (event.webviewPanel.active) {
            this.selectionUpdateEmitter.fire(this.clientSelectionMap.get(client.clientId) || []);
        }
    }

    protected onClientDispose(client: GlspVscodeClient<D>, disposables: vscode.Disposable[]) {
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
    }

    protected disposeClientSessionArgs(client: GlspVscodeClient<D>): Args | undefined {
        return {
            ['sourceUri']: client.document.uri.path
        };
    }
}
