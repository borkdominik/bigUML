/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import type { Action, ResponseAction } from '@eclipse-glsp/vscode-integration';

export namespace VscodeAction {
    export const PREFIX = 'vscode_extension_host';
    export const MARKER = '__vscodeExtensionHost';

    export function prefixRequestId(requestId: string): string {
        return `${PREFIX}_${requestId}`;
    }

    export function isForExtensionHost(action: ResponseAction): boolean {
        return action.responseId.startsWith(PREFIX);
    }

    export function isExtensionOnly(action: Action): boolean {
        return (action as any)[MARKER] === true;
    }

    export function markExtensionOnly<T extends Action>(action: T): T {
        return {
            ...action,
            [MARKER]: true
        };
    }
}
