/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

/** The text of every document a patch touched, keyed by document path. */
export type DocumentTexts = Map<string, string>;

interface HistoryEntry {
    /** The documents as they were before the patch. */
    before: DocumentTexts;
    /** The documents as the patch left them. */
    after: DocumentTexts;
}

/**
 * The undo and redo history of a document: the texts of every document each patch touched, before and
 * after. Kept per document the patch was addressed to, since that is what a client undoes on.
 */
export class UndoRedoHistory {
    private readonly histories = new Map<string, { entries: HistoryEntry[]; position: number }>();

    /** Records a patch. Anything that had been undone is forgotten: it can no longer be redone. */
    record(key: string, before: DocumentTexts, after: DocumentTexts): void {
        const history = this.historyOf(key);
        history.entries.splice(history.position);
        history.entries.push({ before, after });
        history.position = history.entries.length;
    }

    /** The texts to restore to undo the last patch, or `undefined` where there is nothing to undo. */
    undo(key: string): DocumentTexts | undefined {
        const history = this.historyOf(key);
        if (history.position === 0) {
            return undefined;
        }
        history.position -= 1;
        return history.entries[history.position].before;
    }

    /** The texts to restore to redo the last undone patch, or `undefined` where there is nothing to redo. */
    redo(key: string): DocumentTexts | undefined {
        const history = this.historyOf(key);
        if (history.position >= history.entries.length) {
            return undefined;
        }
        const entry = history.entries[history.position];
        history.position += 1;
        return entry.after;
    }

    private historyOf(key: string): { entries: HistoryEntry[]; position: number } {
        let history = this.histories.get(key);
        if (!history) {
            history = { entries: [], position: 0 };
            this.histories.set(key, history);
        }
        return history;
    }
}
