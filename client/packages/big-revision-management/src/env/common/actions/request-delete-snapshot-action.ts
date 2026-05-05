/*********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { Action, type RequestAction, type ResponseAction } from '@eclipse-glsp/protocol';

export interface RequestDeleteSnapshotAction extends RequestAction<ResponseAction> {
    kind: typeof RequestDeleteSnapshotAction.KIND;
    snapshotId: string;
    snapshotName: string;
    requestId: string;
}

export namespace RequestDeleteSnapshotAction {
    export const KIND = 'requestDeleteSnapshot';

    export function is(obj: unknown): obj is RequestDeleteSnapshotAction {
        return Action.hasKind(obj, KIND);
    }

    export function create(snapshotId: string, snapshotName: string): RequestDeleteSnapshotAction {
        return {
            kind: KIND,
            snapshotId,
            snapshotName,
            requestId: crypto.randomUUID()
        };
    }
}

