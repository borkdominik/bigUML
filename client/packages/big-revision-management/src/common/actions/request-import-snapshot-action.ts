/*********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { Action } from '@eclipse-glsp/protocol';
import { type Snapshot } from '../snapshot.js';

export interface RequestImportSnapshotAction extends Action {
    kind: typeof RequestImportSnapshotAction.KIND;
    importedSnapshots: Snapshot[];
}

export namespace RequestImportSnapshotAction {
    export const KIND = 'requestImportSnapshot';

    export function is(obj: unknown): obj is RequestImportSnapshotAction {
        return Action.hasKind(obj, KIND);
    }

    export function create(importedSnapshots: Snapshot[]): RequestImportSnapshotAction {
        return {
            kind: KIND,
            importedSnapshots
        };
    }
}
