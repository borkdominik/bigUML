/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import * as fs from 'fs';
import type { FileSystemProvider } from 'langium';
import { TextDocumentItem } from 'vscode-languageserver-protocol';
import { URI } from 'vscode-uri';

/** The version a document has when it is read fresh from disk. */
const INITIAL_VERSION = 1;

/**
 * The one place a document touches the file system: read as the text document a client opens, and
 * written back when it is saved. Langium's `FileSystemProvider` reads but does not write, so the write
 * goes to the file system directly.
 */
export class DocumentFiles {
    constructor(private readonly fileSystemProvider: FileSystemProvider) {}

    read(uri: string, languageId: string): TextDocumentItem {
        const fileUri = URI.parse(uri);
        const content = this.fileSystemProvider.readFileSync(fileUri);
        return TextDocumentItem.create(fileUri.toString(), languageId, INITIAL_VERSION, content.toString());
    }

    write(uri: string, text: string): void {
        fs.writeFileSync(URI.parse(uri).fsPath, text);
    }
}
