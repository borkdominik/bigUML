/*********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { Action, type RequestAction, type ResponseAction } from '@eclipse-glsp/protocol';

export interface RequestRestoreSnapshotAction extends RequestAction<ResponseAction> {
    kind: typeof RequestRestoreSnapshotAction.KIND;
    snapshotId: string;
    requestId: string;
}

export namespace RequestRestoreSnapshotAction {
    export const KIND = 'requestRestoreSnapshot';

    export function is(obj: unknown): obj is RequestRestoreSnapshotAction {
        return Action.hasKind(obj, KIND);
    }

    export function create(snapshotId: string): RequestRestoreSnapshotAction {
        return {
            kind: KIND,
            snapshotId,
            requestId: crypto.randomUUID()
        };
    }
}

