/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { loggerFactory } from '@borkdominik-biguml/big-common';
import type { AstNode, GenericAstNode } from 'langium';
import { URI } from 'vscode-uri';
import { type ClientId, DIAGRAM_CLIENT } from '../client-id.js';
import { DocumentSynchronizer } from '../document/document-synchronizer.js';
import { type ModelServerSharedServices } from '../model-module.js';
import { type jsonPatch } from '../util/json-types.js';
import { AffectedDocumentCollector } from './affected-documents.js';
import { applyJsonPatch, type JsonDocuments } from './json-patch-applier.js';
import { type DocumentTexts, UndoRedoHistory } from './undo-redo-history.js';

const logger = loggerFactory('PatchManager');

/**
 * Applies a JSON patch to a document and writes the outcome back - to that document and to every
 * document whose references the change touched - then remembers the texts before and after so the
 * patch can be undone and redone.
 *
 * The steps are each somebody else's: the affected documents come from the
 * {@link AffectedDocumentCollector}, the patched JSON from {@link applyJsonPatch}, the linked AST from
 * the language's JSON serializer, the consistent write from the {@link DocumentSynchronizer} and the
 * history from the {@link UndoRedoHistory}. What is left here is the order they happen in.
 */
export class PatchManager {
    protected readonly synchronizer: DocumentSynchronizer;
    protected readonly affectedDocuments: AffectedDocumentCollector;
    protected readonly history = new UndoRedoHistory();

    constructor(protected readonly shared: ModelServerSharedServices) {
        this.synchronizer = new DocumentSynchronizer(shared);
        this.affectedDocuments = new AffectedDocumentCollector(shared.workspace.LangiumDocuments, shared.workspace.IndexManager);
    }

    async applyPatch(
        patch: jsonPatch.Operation | readonly jsonPatch.Operation[],
        uri: string,
        client?: ClientId
    ): Promise<AstNode | undefined> {
        logger.log(`Applying patch to document: ${uri}`, patch);
        const operations = Array.isArray(patch) ? patch : [patch as jsonPatch.Operation];
        const targetPath = URI.parse(uri).path;

        const before: DocumentTexts = new Map();
        const documents: JsonDocuments = new Map();
        for (const affectedUri of await this.affectedDocuments.collect(uri)) {
            const path = URI.parse(affectedUri).path;
            await this.shared.workspace.TextDocumentManager.open(path, undefined, client);
            const document = await this.synchronizer.document(path);
            const serializer = this.servicesFor(path).serializer.JsonSerializer;
            documents.set(path, JSON.parse(serializer.serialize(document.parseResult.value)));
            before.set(path, document.textDocument.getText());
        }

        const patched = this.link(applyJsonPatch(documents, targetPath, operations));

        const after: DocumentTexts = new Map();
        let root: AstNode | undefined;
        for (const [path, ast] of patched) {
            const text = this.servicesFor(path).serializer.Serializer.serialize(ast);
            after.set(path, text);
            const written = await this.write(path, text, path === targetPath, client);
            if (path === targetPath) {
                root = written;
            }
        }

        this.history.record(targetPath, before, after);
        return root;
    }

    async undo(uri: string, client?: ClientId): Promise<AstNode | undefined> {
        const targetPath = URI.parse(uri).path;
        const texts = this.history.undo(targetPath);
        return texts ? this.restore(texts, targetPath, client) : (await this.synchronizer.document(uri)).parseResult.value;
    }

    async redo(uri: string, client?: ClientId): Promise<AstNode | undefined> {
        const targetPath = URI.parse(uri).path;
        const texts = this.history.redo(targetPath);
        return texts ? this.restore(texts, targetPath, client) : (await this.synchronizer.document(uri)).parseResult.value;
    }

    /**
     * Turns the patched JSON back into linked ASTs. A reference from one patched document into another
     * is resolved against the patched version of that other document, not the one still on disk.
     */
    protected link(documents: JsonDocuments): Map<string, AstNode> {
        const linked = documents as Map<string, GenericAstNode>;
        for (const [path, json] of linked) {
            this.servicesFor(path).serializer.JsonSerializer.link(json, documentPath => linked.get(documentPath));
        }
        return linked;
    }

    /** Writes one document's new text; the patched document is rebuilt, the others are saved. */
    protected async write(path: string, text: string, isTarget: boolean, client?: ClientId): Promise<AstNode> {
        const outcome = await this.synchronizer.write(path, text, client);
        if (outcome === 'written') {
            if (isTarget) {
                await this.shared.workspace.DocumentBuilder.update([URI.parse(path)], []);
            } else {
                await this.shared.workspace.TextDocumentManager.save(path, text);
            }
        }
        return (await this.synchronizer.document(path)).parseResult.value;
    }

    /** Puts every document back to a remembered text. */
    protected async restore(texts: DocumentTexts, targetPath: string, client: ClientId = DIAGRAM_CLIENT): Promise<AstNode | undefined> {
        const documentManager = this.shared.workspace.TextDocumentManager;
        let root: AstNode | undefined;
        for (const [path, text] of texts) {
            await documentManager.open(path, undefined, client);
            const document = await this.synchronizer.document(path);
            await documentManager.update(path, document.textDocument.version + 1, text, client);
            await documentManager.save(path, text);
            if (path === targetPath) {
                await this.shared.workspace.DocumentBuilder.update([URI.parse(path)], []);
                root = document.parseResult.value;
            }
        }
        return root;
    }

    protected servicesFor(path: string) {
        return this.shared.ServiceRegistry.getServices(URI.parse(path));
    }
}
