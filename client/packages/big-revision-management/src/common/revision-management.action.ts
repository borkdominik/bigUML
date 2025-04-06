/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { Action, RequestAction, type ResponseAction } from '@eclipse-glsp/protocol';

// ========= This action will be handled by the GLSP Client =========

export interface RequestRevisionManagementAction extends RequestAction<RevisionManagementResponse> {
    kind: typeof RequestRevisionManagementAction.KIND;
    increase: number;
}

export namespace RequestRevisionManagementAction {
    export const KIND = 'requestHelloWorld';

    export function is(object: unknown): object is RequestRevisionManagementAction {
        return RequestAction.hasKind(object, KIND);
    }

    export function create(options: Omit<RequestRevisionManagementAction, 'kind' | 'requestId'>): RequestRevisionManagementAction {
        return {
            kind: KIND,
            requestId: '',
            ...options
        };
    }
}

export interface RevisionManagementResponse extends ResponseAction {
    kind: typeof RevisionManagementResponse.KIND;
    count: number;
}
export namespace RevisionManagementResponse {
    export const KIND = 'revisionManagementResponse';

    export function is(object: unknown): object is RevisionManagementResponse {
        return Action.hasKind(object, KIND);
    }

    export function create(
        options?: Omit<RevisionManagementResponse, 'kind' | 'responseId'> & { responseId?: string }
    ): RevisionManagementResponse {
        return {
            kind: KIND,
            responseId: '',
            count: 0,
            ...options
        };
    }
}
