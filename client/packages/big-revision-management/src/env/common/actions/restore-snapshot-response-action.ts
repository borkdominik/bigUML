/*********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import type { ResponseAction } from '@eclipse-glsp/protocol';

export interface RestoreSnapshotResponseAction extends ResponseAction {
    kind: typeof RestoreSnapshotResponseAction.KIND;
}

export namespace RestoreSnapshotResponseAction {
    export const KIND = 'restoreSnapshotResponse';

    export function create(responseId: string): RestoreSnapshotResponseAction {
        return {
            kind: KIND,
            responseId
        };
    }
}
