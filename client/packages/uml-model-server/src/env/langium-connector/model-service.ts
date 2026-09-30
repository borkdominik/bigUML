/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import type * as jsonpatch from 'fast-json-patch';
import { type AstNode, isAstNode, isReference } from 'langium';
import { type Disposable } from 'vscode-languageserver';
import { URI } from 'vscode-uri';
import { type ExtendedLangiumServices } from '../langium/extended-services.js';
import { type ClientId } from './client-id.js';
import { DocumentSynchronizer } from './document/document-synchronizer.js';
import { type ModelServerSharedServices } from './model-module.js';
import { type PatchManager } from './patch/patch-manager.js';

/**
 * The semantic models as a client that is not a language client sees them: opened, read, changed by
 * patch or wholesale, undone, saved and closed - on behalf of a named client, so that its version of
 * a document is kept apart from the text editor's.
 */
export class ModelService {
    protected readonly synchronizer: DocumentSynchronizer;

    constructor(
        protected readonly shared: ModelServerSharedServices,
        protected readonly patchManager: PatchManager
    ) {
        this.synchronizer = new DocumentSynchronizer(shared);
    }

    protected get documentManager() {
        return this.shared.workspace.TextDocumentManager;
    }

    /** Opens the document with the given URI for modification by the given client. */
    async open(uri: string, client?: ClientId): Promise<void> {
        return this.documentManager.open(uri, undefined, client);
    }

    /** Closes the document with the given URI for the given client. */
    async close(uri: string, client?: ClientId): Promise<void> {
        return this.documentManager.close(uri, client);
    }

    /**
     * The semantic model stored in the document with the given URI, if it matches the guard. Opens the
     * document for the client where it is not open yet.
     */
    async request<T extends AstNode = AstNode>(
        uri: string,
        guard: (item: unknown) => item is T = isAstNode as (item: unknown) => item is T,
        client?: ClientId
    ): Promise<T | undefined> {
        await this.open(uri, client);
        const root = (await this.synchronizer.document(uri)).parseResult.value;
        return guard(root) ? root : undefined;
    }

    getLanguageSpecificServices(uri: string): ExtendedLangiumServices {
        return this.shared.ServiceRegistry.getServices(URI.parse(uri));
    }

    /** The elements the document refers to under the given name. */
    async getCrossReferences(uri: string, ref: string): Promise<{ references: AstNode[] }> {
        await this.open(uri);
        const document = await this.synchronizer.document(uri);
        await this.shared.workspace.IndexManager.updateReferences(document);

        const references: AstNode[] = [];
        document.references.forEach(reference => {
            if (isReference(reference) && reference.$nodeDescription?.name === ref && reference.$refNode) {
                references.push(reference.$refNode.astNode);
            }
        });
        return { references };
    }

    async patch<T extends AstNode>(
        uri: string,
        patch: string | jsonpatch.Operation | readonly jsonpatch.Operation[],
        client?: ClientId
    ): Promise<T> {
        const operations = typeof patch === 'string' ? (JSON.parse(patch) as jsonpatch.Operation[]) : patch;
        return (await this.patchManager.applyPatch(operations, uri, client)) as T;
    }

    async undo<T extends AstNode>(uri: string, client?: ClientId): Promise<T> {
        return (await this.patchManager.undo(uri, client)) as T;
    }

    async redo<T extends AstNode>(uri: string, client?: ClientId): Promise<T> {
        return (await this.patchManager.redo(uri, client)) as T;
    }

    /**
     * Replaces the semantic model stored in the document with the given model, or the given text of
     * one. Opens the document for the client where it is not open yet.
     *
     * Where the text editor has changed the document past what the client holds and left it with
     * errors, nothing is written and an empty object comes back: the client cannot modify a document
     * the editor has broken, and the empty model is how it is told so.
     */
    async update<T extends AstNode>(uri: string, model: T | string, client?: ClientId): Promise<T> {
        await this.open(uri, client);
        const document = await this.synchronizer.document(uri);
        if (!isAstNode(document.parseResult.value)) {
            throw new Error(`No AST node to update exists in '${uri}'`);
        }

        const text = typeof model === 'string' ? model : this.serialize(uri, model);
        const outcome = await this.synchronizer.write(uri, text, client);
        if (outcome === 'rejected') {
            return {} as T;
        }
        if (outcome === 'written') {
            await this.shared.workspace.DocumentBuilder.update([URI.parse(uri)], []);
        }
        return document.parseResult.value as T;
    }

    /** Listens for changes the text editor makes to the document - see `OpenTextDocumentManager.onUpdate`. */
    onUpdate<T extends AstNode>(uri: string, client: ClientId, listener: (model: T) => void): Disposable {
        return this.documentManager.onUpdate(uri, client, listener);
    }

    /** Writes the given model, or the given text of one, to the document's file. */
    async save(uri: string, model: AstNode | string): Promise<void> {
        const text = typeof model === 'string' ? model : this.serialize(uri, model);
        return this.documentManager.save(uri, text);
    }

    /** The text of the given model, as the language for the document writes it. */
    protected serialize(uri: string, model: AstNode): string {
        return this.getLanguageSpecificServices(uri).serializer.Serializer.serialize(model);
    }
}
