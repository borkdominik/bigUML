/*********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import type { ResponseAction } from '@eclipse-glsp/protocol';

export interface DeleteSnapshotResponseAction extends ResponseAction {
    kind: typeof DeleteSnapshotResponseAction.KIND;
}

export namespace DeleteSnapshotResponseAction {
    export const KIND = 'deleteSnapshotResponse';

    export function create(responseId: string): DeleteSnapshotResponseAction {
        return {
            kind: KIND,
            responseId
        };
    }
}
