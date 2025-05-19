/*********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { Action } from '@eclipse-glsp/protocol';
import type { GModelRootSchema } from '@eclipse-glsp/protocol';

export interface RestoreModelStateAction extends Action {
    kind: typeof RestoreModelStateAction.KIND;
    model: GModelRootSchema; // or ExperimentalModelState if you keep that
}

export namespace RestoreModelStateAction {
    export const KIND = 'restoreModelState';

    export function is(obj: unknown): obj is RestoreModelStateAction {
        return Action.hasKind(obj, KIND);
    }

    export function create(model: GModelRootSchema): RestoreModelStateAction {
        return {
            kind: KIND,
            model
        };
    }
}
