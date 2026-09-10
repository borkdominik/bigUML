/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import type { NotificationType } from 'vscode-messenger-common';

/**
 * Sent from the extension host to the webview whenever the diagram's model
 * state changes (replace, manual edit, undo/redo, …). The webview uses it to
 * refresh its current result list and to retire stale state such as the
 * post-replace Undo button, whose target may no longer be on top of the
 * command stack after an unrelated edit.
 */
export namespace ModelChangedNotification {
    export const TYPE: NotificationType<void> = { method: 'big.advancedsearch.modelChanged' };
}
