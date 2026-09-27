/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import type { IndexManager, LangiumDocuments } from 'langium';
import { URI } from 'vscode-uri';

/**
 * Finds every document a change to one document reaches: the document itself, every document that
 * references it, every document that references one of those, and so on. Their references are what
 * a patch has to keep pointing at the right element.
 */
export class AffectedDocumentCollector {
    constructor(
        protected readonly documents: LangiumDocuments,
        protected readonly indexManager: IndexManager
    ) {}

    /** The URIs (as strings) of every affected document, the given one included. */
    async collect(uri: string): Promise<Set<string>> {
        const affected = new Set<string>([URI.parse(uri).toString()]);
        let grown = true;
        while (grown) {
            grown = false;
            for (const document of this.documents.all) {
                const documentUri = document.uri.toString();
                if (affected.has(documentUri)) {
                    continue;
                }
                await this.indexManager.updateReferences(document);
                if (this.indexManager.isAffected(document, affected)) {
                    affected.add(documentUri);
                    grown = true;
                }
            }
        }
        return affected;
    }
}
