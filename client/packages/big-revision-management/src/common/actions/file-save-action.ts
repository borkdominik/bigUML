/*********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { Action, type ResponseAction } from '@eclipse-glsp/protocol';
import { type Snapshot } from '../snapshot.js';

export interface FileSaveResponse extends ResponseAction {
    kind: typeof FileSaveResponse.KIND;
    timeline: Snapshot[];
}
export namespace FileSaveResponse {
    export const KIND = 'fileSaveResponse';

    export function is(object: unknown): object is FileSaveResponse {
        return Action.hasKind(object, KIND);
    }

    export function create(options?: Omit<FileSaveResponse, 'kind' | 'responseId'> & { responseId?: string }): FileSaveResponse {
        return {
            kind: KIND,
            responseId: '',
            timeline: [],
            ...options
        };
    }
}
