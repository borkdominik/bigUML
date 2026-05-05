/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import type { Action } from '@eclipse-glsp/vscode-integration';

/**
 * A VSCode action is an action dispatched within the VSCode extension.
 * It allows the VSCode connector to identify the action and handle it accordingly.
 */
export namespace VscodeAction {
    export const PREFIX = 'vscode_extension_host';
    export const MARKER = '__vscodeExtensionHost';

    /**
     * Prefix the request ID with the extension host prefix.
     * This is used to identify actions that are intended for the extension host.
     * The response actions will be catched by the extension and not further delegated.
     */
    export function prefixRequestId(requestId: string): string {
        return `${PREFIX}_${requestId}`;
    }

    /**
     * Check if the request ID is prefixed with the extension host prefix.
     * This is used to identify actions that are intended for the extension host.
     */
    export function isVSCodeRequestId(requestId: string): boolean {
        return requestId.startsWith(PREFIX);
    }

    /**
     * Check if an action is marked as extension only.
     * This is used to identify actions that are intended for the extension host.
     */
    export function isExtensionOnly(action: Action): boolean {
        return (action as any)[MARKER] === true;
    }

    /**
     * Mark an action as extension only.
     * This is used to identify actions that are intended for the extension host.
     *
     * The GLSP client will mark the action as extension only, so it will not be propagated to the server by the connector.
     * Search for {@link ExtensionActionKind} for propagation.
     */
    export function markExtensionOnly<T extends Action>(action: T): T {
        return {
            ...action,
            [MARKER]: true
        };
    }
}
