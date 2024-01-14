/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { Action } from '@eclipse-glsp/protocol';

export interface GLSPIsReadyAction extends Action {
    kind: typeof GLSPIsReadyAction.KIND;
}

export namespace GLSPIsReadyAction {
    export const KIND = 'glspIsReady';

    export function is(object: any): object is GLSPIsReadyAction {
        return Action.hasKind(object, KIND);
    }

    export function create(): GLSPIsReadyAction {
        return {
            kind: KIND
        };
    }
}
