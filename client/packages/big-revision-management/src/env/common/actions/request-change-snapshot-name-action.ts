/*********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { Action } from '@eclipse-glsp/protocol';

export interface RequestChangeSnapshotNameAction extends Action {
    kind: typeof RequestChangeSnapshotNameAction.KIND;
    snapshotId: string;
    name: string;
}

export namespace RequestChangeSnapshotNameAction {
    export const KIND = 'requestChangeSnapshotName';

    export function is(obj: unknown): obj is RequestChangeSnapshotNameAction {
        return Action.hasKind(obj, KIND);
    }

    export function create(snapshotId: string, name: string): RequestChangeSnapshotNameAction {
        return {
            kind: KIND,
            snapshotId,
            name
        };
    }
}
