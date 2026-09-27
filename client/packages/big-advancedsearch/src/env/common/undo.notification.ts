/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import type { NotificationType } from 'vscode-messenger-common';

/**
 * Sent from the webview to ask the extension host to undo the last change in
 * the active diagram. The host routes a GLSP `UndoAction` to the active GLSP
 * client (the diagram webview), which sends an `UndoOperation` to the server —
 * the search panel can't dispatch it itself because its clientId isn't in the
 * connector's diagram-client map.
 */
export namespace UndoNotification {
    export const TYPE: NotificationType<void> = { method: 'big.advancedsearch.undo' };
}
