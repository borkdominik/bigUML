/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import {
    type CancellationToken,
    type Connection,
    type DidChangeTextDocumentParams,
    type DidCloseTextDocumentParams,
    type DidOpenTextDocumentParams,
    type DidSaveTextDocumentParams,
    Disposable,
    type DocumentUri,
    type Emitter,
    type HandlerResult,
    type RequestHandler,
    type TextDocumentChangeEvent,
    TextDocuments,
    type TextDocumentsConfiguration,
    TextDocumentSyncKind,
    type TextDocumentWillSaveEvent,
    type TextEdit,
    type WillSaveTextDocumentParams
} from 'vscode-languageserver';
import type { ClientId } from '../client-id.js';

/**
 * Langium's text document store, with its document-sync notifications callable from inside the server.
 *
 * `TextDocuments` only ever hears about documents from the language client. Here a document may be
 * opened and changed by another client - the diagram - and the store has to learn of that the same
 * way, so the handlers the client's notifications would run are exposed as methods. A notification
 * that names a client is one such internal one: the store is updated, but the events that the text
 * editor's own edits fire are held back, since the change did not come from the editor.
 */
export class OpenableTextDocuments<T extends { version: number; uri: DocumentUri }> extends TextDocuments<T> {
    public constructor(protected configuration: TextDocumentsConfiguration<T>) {
        super(configuration);
    }

    // The base class keeps its state private; these read it back for the methods below.
    protected get syncedDocuments(): Map<string, T> {
        return this['_syncedDocuments'];
    }

    protected get onDidChangeContentEmitter(): Emitter<TextDocumentChangeEvent<T>> {
        return this['_onDidChangeContent'];
    }

    protected get onDidOpenEmitter(): Emitter<TextDocumentChangeEvent<T>> {
        return this['_onDidOpen'];
    }

    protected get onDidCloseEmitter(): Emitter<TextDocumentChangeEvent<T>> {
        return this['_onDidClose'];
    }

    protected get onDidSaveEmitter(): Emitter<TextDocumentChangeEvent<T>> {
        return this['_onDidSave'];
    }

    protected get onWillSaveEmitter(): Emitter<TextDocumentWillSaveEvent<T>> {
        return this['_onWillSave'];
    }

    protected get willSaveWaitUntilHandler(): RequestHandler<TextDocumentWillSaveEvent<T>, TextEdit[], void> | undefined {
        return this['_willSaveWaitUntil'];
    }

    public override listen(connection: Connection): Disposable {
        (connection as unknown as { __textDocumentSync: TextDocumentSyncKind }).__textDocumentSync = TextDocumentSyncKind.Incremental;
        const disposables: Disposable[] = [
            connection.onDidOpenTextDocument(event => this.notifyDidOpenTextDocument(event)),
            connection.onDidChangeTextDocument(event => this.notifyDidChangeTextDocument(event)),
            connection.onDidCloseTextDocument(event => this.notifyDidCloseTextDocument(event)),
            connection.onWillSaveTextDocument(event => this.notifyWillSaveTextDocument(event)),
            connection.onWillSaveTextDocumentWaitUntil((event, token) => this.notifyWillSaveTextDocumentWaitUntil(event, token)),
            connection.onDidSaveTextDocument(event => this.notifyDidSaveTextDocument(event))
        ];
        return Disposable.create(() => disposables.forEach(disposable => disposable.dispose()));
    }

    public notifyDidChangeTextDocument(event: DidChangeTextDocumentParams, client?: ClientId): void {
        const { textDocument, contentChanges } = event;
        if (contentChanges.length === 0) {
            return;
        }
        const { version } = textDocument;
        if (version === null || version === undefined) {
            throw new Error(`Received document change event for ${textDocument.uri} without valid version identifier`);
        }

        let syncedDocument = this.syncedDocuments.get(textDocument.uri);
        if (syncedDocument === undefined) {
            return;
        }
        if (syncedDocument.version < version) {
            syncedDocument = this.configuration.update(syncedDocument, contentChanges, version);
            this.syncedDocuments.set(textDocument.uri, syncedDocument);
        }
        // Only the text editor's own edits are announced as content changes: a change another client
        // made is already known to that client, and announcing it would write it back a second time.
        if (syncedDocument.version <= version && !client) {
            this.onDidChangeContentEmitter.fire(Object.freeze({ document: syncedDocument }));
        }
    }

    public notifyDidCloseTextDocument(event: DidCloseTextDocumentParams, deleteFromSyncedDocuments = false): void {
        const syncedDocument = this.syncedDocuments.get(event.textDocument.uri);
        if (syncedDocument !== undefined) {
            this.onDidCloseEmitter.fire(Object.freeze({ document: syncedDocument }));
        }
        if (deleteFromSyncedDocuments) {
            this.syncedDocuments.delete(event.textDocument.uri);
        }
    }

    public notifyWillSaveTextDocument(event: WillSaveTextDocumentParams): void {
        const syncedDocument = this.syncedDocuments.get(event.textDocument.uri);
        if (syncedDocument !== undefined) {
            this.onWillSaveEmitter.fire(Object.freeze({ document: syncedDocument, reason: event.reason }));
        }
    }

    public notifyWillSaveTextDocumentWaitUntil(event: WillSaveTextDocumentParams, token: CancellationToken): HandlerResult<TextEdit[], void> {
        const syncedDocument = this.syncedDocuments.get(event.textDocument.uri);
        if (syncedDocument !== undefined && this.willSaveWaitUntilHandler) {
            return this.willSaveWaitUntilHandler(Object.freeze({ document: syncedDocument, reason: event.reason }), token);
        }
        return [];
    }

    public notifyDidSaveTextDocument(event: DidSaveTextDocumentParams): void {
        const syncedDocument = this.syncedDocuments.get(event.textDocument.uri);
        if (syncedDocument !== undefined) {
            this.onDidSaveEmitter.fire(Object.freeze({ document: syncedDocument }));
        }
    }

    public notifyDidOpenTextDocument(event: DidOpenTextDocumentParams, client?: ClientId): void {
        const { textDocument } = event;
        const document = this.configuration.create(textDocument.uri, textDocument.languageId, textDocument.version, textDocument.text);

        // Kept only where it is newer than what the store already holds.
        const syncedDocument = this.syncedDocuments.get(textDocument.uri);
        if (!syncedDocument || syncedDocument.version < document.version) {
            this.syncedDocuments.set(textDocument.uri, document);
        }
        // Only an open by the text editor is announced - see `notifyDidChangeTextDocument`.
        if (!client) {
            this.onDidOpenEmitter.fire(Object.freeze({ document }));
        }
    }

    /** Replaces a document's whole text at a given version, bypassing the version check a change carries. */
    update(textDocument: T, text: string, version: number): void {
        this.configuration.update(textDocument, [{ text }], version);
    }
}
