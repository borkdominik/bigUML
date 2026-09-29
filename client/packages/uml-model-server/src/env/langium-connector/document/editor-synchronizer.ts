/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { type Connection, WorkspaceChange } from 'vscode-languageserver';
import type { OpenDocumentEntry } from './open-document-registry.js';

/**
 * Pushes text into an open text editor through the language server protocol - the one way the server
 * has of changing what the editor shows when another client edited the document.
 */
export class EditorSynchronizer {
    constructor(private readonly connection: Connection | undefined) {}

    /** Replaces the whole content of the editor showing `uri`. */
    async replaceContent(uri: string, text: string): Promise<void> {
        if (!this.connection) {
            return;
        }
        const workspaceChange = new WorkspaceChange();
        workspaceChange.getTextEditChange(uri).replace(
            {
                start: { line: 0, character: 0 },
                end: { line: Number.MAX_SAFE_INTEGER, character: Number.MAX_SAFE_INTEGER }
            },
            text
        );
        await this.connection.workspace.applyEdit(workspaceChange.edit);
    }

    /**
     * Brings an editor that opened a document another client had already edited up to that client's
     * version. The editor counts a version per edit it receives, so it is given one edit per version it
     * is behind - alternating a trailing newline, because an edit that leaves the text as it is does not
     * count as a change and would not move the version at all.
     */
    async catchUp(uri: string, target: OpenDocumentEntry, editorVersion: number): Promise<void> {
        const edits = target.version - editorVersion + 1;
        for (let edit = 1; edit <= edits; edit++) {
            await this.replaceContent(uri, target.text);
            await this.replaceContent(uri, edit % 2 === 0 ? target.text + '\n' : target.text);
        }
    }
}
