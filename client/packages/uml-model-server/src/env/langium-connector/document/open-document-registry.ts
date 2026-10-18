/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { type ClientId, TEXT_EDITOR_CLIENT } from '../client-id.js';

/** What a client last saw of a document: the version it holds and the text at that version. */
export interface OpenDocumentEntry {
    version: number;
    text: string;
}

/**
 * Which documents are open with which clients, and at what version each client holds them. Nothing
 * but bookkeeping: the URIs are expected normalised by the caller, and no client is favoured here.
 */
export class OpenDocumentRegistry {
    private readonly entries = new Map<string, OpenDocumentEntry>();

    set(uri: string, client: ClientId, entry: OpenDocumentEntry): void {
        this.entries.set(key(uri, client), entry);
    }

    get(uri: string, client: ClientId): OpenDocumentEntry | undefined {
        return this.entries.get(key(uri, client));
    }

    has(uri: string, client: ClientId): boolean {
        return this.entries.has(key(uri, client));
    }

    delete(uri: string, client: ClientId): void {
        this.entries.delete(key(uri, client));
    }

    /** Whether any client at all holds the document open. */
    isOpenWithAnyClient(uri: string): boolean {
        return [...this.entries.keys()].some(entryKey => uriOf(entryKey) === uri);
    }

    /** The version a client holds the document at, or 0 where it does not hold it. */
    version(uri: string, client: ClientId): number {
        return this.get(uri, client)?.version ?? 0;
    }

    /** The highest version any client holds the document at - at least 1, the version a freshly read file has. */
    newestVersion(uri: string): number {
        return Math.max(1, ...this.entriesOf(uri).map(([, entry]) => entry.version));
    }

    /**
     * The newest state a client other than the text editor holds the document in. Used to tell whether
     * an update came from the text editor or from one of the other clients.
     */
    newestNonTextEditorEntry(uri: string): OpenDocumentEntry | undefined {
        let newest: OpenDocumentEntry | undefined;
        for (const [client, entry] of this.entriesOf(uri)) {
            if (client !== TEXT_EDITOR_CLIENT && entry.version > (newest?.version ?? 0)) {
                newest = entry;
            }
        }
        return newest;
    }

    private entriesOf(uri: string): [ClientId, OpenDocumentEntry][] {
        return [...this.entries.entries()]
            .filter(([entryKey]) => uriOf(entryKey) === uri)
            .map(([entryKey, entry]) => [clientOf(entryKey), entry]);
    }
}

const SEPARATOR = '\u0000';

function key(uri: string, client: ClientId): string {
    return `${uri}${SEPARATOR}${client}`;
}

function uriOf(entryKey: string): string {
    return entryKey.slice(0, entryKey.indexOf(SEPARATOR));
}

function clientOf(entryKey: string): ClientId {
    return entryKey.slice(entryKey.indexOf(SEPARATOR) + 1);
}
