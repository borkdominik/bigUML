/*********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { Action } from '@eclipse-glsp/protocol';

export interface RequestExportSnapshotAction extends Action {
    kind: typeof RequestExportSnapshotAction.KIND;
}

export namespace RequestExportSnapshotAction {
    export const KIND = 'requestExportSnapshot';

    export function is(obj: unknown): obj is RequestExportSnapshotAction {
        return Action.hasKind(obj, KIND);
    }

    export function create(): RequestExportSnapshotAction {
        return {
            kind: KIND
        };
    }
}
