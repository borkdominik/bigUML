/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import type { LangiumDocument } from 'langium';
import { URI } from 'vscode-uri';
import { type ClientId, clientOrTextEditor, TEXT_EDITOR_CLIENT } from '../client-id.js';
import { type ModelServerSharedServices } from '../model-module.js';
import { isFreeOfBlockingErrors } from './document-diagnostics.js';

/** What became of a write. */
export type WriteOutcome =
    /** The text is the document's new content, at a version the client now holds. */
    | 'written'
    /** The text editor was ahead; the client caught up to the editor's version and the text was recorded against it. */
    | 'caught-up'
    /** The text editor was ahead and has left the document with errors; nothing was written. */
    | 'rejected';

/**
 * Writes new text for a document on behalf of a client, keeping the client's version and the text
 * editor's consistent.
 *
 * The text editor is the client whose version counts: an edit there moves the document's version
 * whether or not the server was asked. So a client that is behind the editor does not overwrite what
 * the editor holds - it catches up to the editor's version first, and only where the editor has not
 * left the document broken.
 */
export class DocumentSynchronizer {
    constructor(protected readonly shared: ModelServerSharedServices) {}

    async write(uri: string, text: string, client?: ClientId): Promise<WriteOutcome> {
        const documentManager = this.shared.workspace.TextDocumentManager;
        const document = await this.document(uri);
        const who = clientOrTextEditor(client);
        const version = documentManager.getClientDocumentVersion(uri, who);
        const editorVersion = documentManager.getClientDocumentVersion(uri, TEXT_EDITOR_CLIENT);

        if (who !== TEXT_EDITOR_CLIENT && version < editorVersion) {
            if (!isFreeOfBlockingErrors(document)) {
                return 'rejected';
            }
            await documentManager.update(uri, editorVersion, text, client);
            return 'caught-up';
        }

        this.shared.workspace.TextDocuments.update(document.textDocument, text, version);
        await documentManager.update(uri, document.textDocument.version + 1, text, client);
        return 'written';
    }

    async document(uri: string): Promise<LangiumDocument> {
        return this.shared.workspace.LangiumDocuments.getOrCreateDocument(URI.parse(uri));
    }
}
