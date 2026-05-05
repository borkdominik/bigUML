/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 * Copyright (c) 2023 CrossBreeze.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { AbstractFormatter, type AstNode, type LangiumDocument } from 'langium';
import type { DocumentFormattingParams, DocumentRangeFormattingParams, TextEdit } from 'vscode-languageserver';
import { Range } from 'vscode-languageserver-types';

export class UmlDiagramModelFormatter extends AbstractFormatter {
    override formatDocument(document: LangiumDocument, _params: DocumentFormattingParams): TextEdit[] {
        return this.formatAsJson(document);
    }

    override formatDocumentRange(document: LangiumDocument, _params: DocumentRangeFormattingParams): TextEdit[] {
        return this.formatAsJson(document);
    }

    protected format(_node: AstNode): void {
        // Formatting is handled at the document level via JSON.stringify
    }

    private formatAsJson(document: LangiumDocument): TextEdit[] {
        const text = document.textDocument.getText();
        try {
            const parsed = JSON.parse(text);
            const formatted = JSON.stringify(parsed, null, '\t') + '\n';
            if (text === formatted) return [];
            const end = document.textDocument.positionAt(text.length);
            return [{ range: Range.create(0, 0, end.line, end.character), newText: formatted }];
        } catch {
            return [];
        }
    }
}
