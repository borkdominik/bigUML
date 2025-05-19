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

export interface RequestAdvancedSearchAction extends RequestAction<AdvancedSearchActionResponse> {
    kind: typeof RequestAdvancedSearchAction.KIND;
    increase: number;
}

export namespace RequestAdvancedSearchAction {
    export const KIND = 'requestAdvancedSearch';

    export function is(object: unknown): object is RequestAdvancedSearchAction {
        return RequestAction.hasKind(object, KIND);
    }

    export function create(options: Omit<RequestAdvancedSearchAction, 'kind' | 'requestId'>): RequestAdvancedSearchAction {
        return {
            kind: KIND,
            requestId: '',
            ...options
        };
    }
}

export interface AdvancedSearchActionResponse extends ResponseAction {
    kind: typeof AdvancedSearchActionResponse.KIND;
    model: any;
}
export namespace AdvancedSearchActionResponse {
    export const KIND = 'advancedSearchResponse';

    export function is(object: unknown): object is AdvancedSearchActionResponse {
        return Action.hasKind(object, KIND);
    }

    export function create(
        options?: Omit<AdvancedSearchActionResponse, 'kind' | 'responseId'> & { responseId?: string }
    ): AdvancedSearchActionResponse {
        return {
            kind: KIND,
            responseId: '',
            model: 0,
            ...options
        };
    }
}
