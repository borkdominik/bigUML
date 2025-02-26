/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { Action } from '@eclipse-glsp/protocol';

export interface NliErrorAction extends Action {
    kind: typeof NliErrorAction.KIND;
    message: string;
}

export namespace NliErrorAction {
    export const KIND = 'nliErrorAction';

    export function is(object: any): object is NliErrorAction {
        return Action.hasKind(object, KIND);
    }

    export function create(message: string): NliErrorAction {
        return {
            kind: KIND,
            message: message
        };
    }
}