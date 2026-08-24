/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import {
    type Action,
    DelKeyDeleteTool,
    DeleteElementOperation,
    DeleteKeyListener,
    type GModelElement,
    isDeletable,
    isSelectable,
    matchesKeystroke
} from '@eclipse-glsp/client';
import { injectable } from 'inversify';

/** Whether the key went to somewhere text is being typed, where backspace rubs out a character. */
function isTextEntry(target: EventTarget | null): boolean {
    return (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        (target instanceof HTMLElement && target.isContentEditable)
    );
}

/**
 * Deletes the selection on `Backspace` as well as on `Delete`.
 *
 * Unlike `Delete`, backspace is also how a character is rubbed out - so it deletes a shape only when the
 * key did not go to a field someone is typing in. Renaming an element would otherwise delete it at the
 * first correction.
 */
@injectable()
export class UmlDeleteKeyListener extends DeleteKeyListener {
    override keyDown(element: GModelElement, event: KeyboardEvent): Action[] {
        if (!matchesKeystroke(event, 'Backspace')) {
            return super.keyDown(element, event);
        }
        if (isTextEntry(event.target)) {
            return [];
        }

        const deletableIds = Array.from(
            element.root.index
                .all()
                .filter(candidate => isDeletable(candidate) && isSelectable(candidate) && candidate.selected)
                .filter(candidate => candidate.id !== candidate.root.id)
                .map(candidate => candidate.id)
        );
        return deletableIds.length > 0 ? [DeleteElementOperation.create(deletableIds)] : [];
    }
}

/**
 * The stock tool with the listener above in place of its own. The tool builds its listener itself rather
 * than having one injected, so swapping the listener means swapping the tool that holds it.
 */
@injectable()
export class UmlDelKeyDeleteTool extends DelKeyDeleteTool {
    protected override deleteKeyListener = new UmlDeleteKeyListener();
}
