/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { type AstNode, type DocumentBuilder, DocumentState } from 'langium';
import { type LangiumSharedServices } from 'langium/lsp';
import { type Disposable } from 'vscode-languageserver';
import { TextDocumentIdentifier, VersionedTextDocumentIdentifier } from 'vscode-languageserver-protocol';
import { type TextDocument } from 'vscode-languageserver-textdocument';
import { URI } from 'vscode-uri';
import { UmlDiagramLanguageMetaData } from '../../grammar.js';
import { type ClientId, clientOrTextEditor, TEXT_EDITOR_CLIENT } from '../client-id.js';
import { type AddedSharedModelServices } from '../model-module.js';
import { DocumentFiles } from './document-files.js';
import { isFreeOfBlockingErrors } from './document-diagnostics.js';
import { EditorSynchronizer } from './editor-synchronizer.js';
import { OpenDocumentRegistry } from './open-document-registry.js';
import { type OpenableTextDocuments } from './openable-text-documents.js';

/**
 * Which client holds which document open, at which version - and what follows from a client opening,
 * changing or closing one: the text document store learns of it, and the text editor is brought up to
 * date when another client is ahead of it.
 *
 * The text editor is one client among the others here, reaching this through the store's events.
 */
export class OpenTextDocumentManager {
    protected readonly openDocuments = new OpenDocumentRegistry();
    protected readonly files: DocumentFiles;
    protected readonly editor: EditorSynchronizer;
    protected readonly textDocuments: OpenableTextDocuments<TextDocument>;
    protected readonly documentBuilder: DocumentBuilder;

    constructor(services: LangiumSharedServices & AddedSharedModelServices) {
        this.textDocuments = services.workspace.TextDocuments;
        this.documentBuilder = services.workspace.DocumentBuilder;
        this.files = new DocumentFiles(services.workspace.FileSystemProvider);
        this.editor = new EditorSynchronizer(services.lsp.Connection);

        this.textDocuments.onDidOpen(event => this.open(event.document.uri, event.document.languageId));
        this.textDocuments.onDidClose(event => this.close(event.document.uri));
        this.textDocuments.onDidChangeContent(event => this.update(event.document.uri, event.document.version, event.document.getText()));
    }

    /** Opens a document for a client. A document already open for that client stays as it is. */
    async open(uri: string, languageId: string = UmlDiagramLanguageMetaData.languageId, client?: ClientId): Promise<void> {
        const normalizedUri = this.normalizedUri(uri);
        const who = clientOrTextEditor(client);
        if (this.openDocuments.has(normalizedUri, who)) {
            return;
        }
        const textDocument = this.files.read(uri, languageId);
        this.openDocuments.set(normalizedUri, who, { version: textDocument.version, text: textDocument.text });
        this.textDocuments.notifyDidOpenTextDocument({ textDocument }, client);

        // The text editor opening a document another client has already edited is shown that client's
        // text, not what is on disk.
        if (who === TEXT_EDITOR_CLIENT && this.openDocuments.newestVersion(normalizedUri) > textDocument.version) {
            const newest = this.openDocuments.newestNonTextEditorEntry(normalizedUri);
            if (newest) {
                await this.editor.catchUp(uri, newest, textDocument.version);
            }
        }
    }

    /** Closes a document for a client. The store lets it go once no client holds it any more. */
    async close(uri: string, client?: ClientId): Promise<void> {
        const normalizedUri = this.normalizedUri(uri);
        const who = clientOrTextEditor(client);
        if (!this.openDocuments.has(normalizedUri, who)) {
            return;
        }
        this.openDocuments.delete(normalizedUri, who);
        if (!this.openDocuments.isOpenWithAnyClient(normalizedUri)) {
            this.textDocuments.notifyDidCloseTextDocument({ textDocument: TextDocumentIdentifier.create(uri) }, true);
        }
    }

    /**
     * Records the text a client now holds a document at. A change by a client other than the text
     * editor that is ahead of the editor is pushed into the store and, where the editor shows the
     * document, into the editor as well. The document has to have been opened for the client first.
     */
    async update(uri: string, version: number, text: string, client?: ClientId): Promise<void> {
        const normalizedUri = this.normalizedUri(uri);
        const who = clientOrTextEditor(client);
        if (!this.openDocuments.has(normalizedUri, who)) {
            throw new Error(`Document ${uri} hasn't been opened for updating yet`);
        }
        this.openDocuments.set(normalizedUri, who, { version, text });
        if (who === TEXT_EDITOR_CLIENT) {
            return;
        }

        const editorEntry = this.openDocuments.get(normalizedUri, TEXT_EDITOR_CLIENT);
        const editorIsBehind = editorEntry !== undefined && version > editorEntry.version;
        if (editorEntry !== undefined && !editorIsBehind) {
            return;
        }
        this.textDocuments.notifyDidChangeTextDocument(
            { textDocument: VersionedTextDocumentIdentifier.create(normalizedUri, version), contentChanges: [{ text }] },
            client
        );
        if (editorIsBehind) {
            await this.editor.replaceContent(uri, text);
        }
    }

    /** Writes a document's text to disk and announces the save. */
    async save(uri: string, text: string): Promise<void> {
        this.files.write(uri, text);
        this.textDocuments.notifyDidSaveTextDocument({ textDocument: TextDocumentIdentifier.create(uri) });
    }

    /**
     * Calls the listener whenever the text editor has changed the document past what the client holds
     * and the result is something the client can take over - see `isFreeOfBlockingErrors`.
     */
    onUpdate<T extends AstNode>(uri: string, client: ClientId, listener: (model: T) => void): Disposable {
        const normalizedUri = this.normalizedUri(uri);
        return this.documentBuilder.onBuildPhase(DocumentState.Validated, changedDocuments => {
            const changed = changedDocuments.find(document => document.uri.toString() === normalizedUri);
            if (!changed) {
                return;
            }
            const clientVersion = this.openDocuments.version(normalizedUri, client);
            const editorVersion = this.openDocuments.version(normalizedUri, TEXT_EDITOR_CLIENT);
            if (clientVersion && editorVersion > clientVersion && isFreeOfBlockingErrors(changed)) {
                listener(changed.parseResult.value as T);
            }
        });
    }

    /** The version a client holds a document at, or 0 where it does not hold it. */
    getClientDocumentVersion(uri: string, client: ClientId): number {
        return this.openDocuments.version(this.normalizedUri(uri), client);
    }

    protected normalizedUri(uri: string): string {
        return URI.parse(uri).toString();
    }
}
