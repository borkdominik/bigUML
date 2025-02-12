/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { Action } from '@eclipse-glsp/protocol';

export interface ExportHistoryAction extends Action {
    kind: typeof ExportHistoryAction.KIND;
    inputHistory: [string, string][];
}

export namespace ExportHistoryAction {
    export const KIND = 'exportHistoryAction';

    export function is(object: any): object is ExportHistoryAction {
        return Action.hasKind(object, KIND);
    }

    export function create(inputHistory: Map<string, string>): ExportHistoryAction {
        return {
            kind: KIND,
            inputHistory: Array.from(inputHistory)
        };
    }
}
