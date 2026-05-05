/*********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { Action } from '@eclipse-glsp/protocol';

export interface RequestSaveFileAction extends Action {
    kind: typeof RequestSaveFileAction.KIND;
}

export namespace RequestSaveFileAction {
    export const KIND = 'requestSaveFile';

    export function is(obj: unknown): obj is RequestSaveFileAction {
        return Action.hasKind(obj, KIND);
    }

    export function create(): RequestSaveFileAction {
        return {
            kind: KIND
        };
    }
}