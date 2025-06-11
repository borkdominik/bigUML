/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { Action, RequestAction, type ResponseAction } from '@eclipse-glsp/protocol';

/**
 * Request sent from WebView to backend to initiate an advanced search.
 */
export interface RequestAdvancedSearchAction extends RequestAction<AdvancedSearchActionResponse> {
    kind: typeof RequestAdvancedSearchAction.KIND;
    query: string;
}

export namespace RequestAdvancedSearchAction {
    export const KIND = 'requestAdvancedSearch';

    export function is(object: unknown): object is RequestAdvancedSearchAction {
        return RequestAction.hasKind(object, KIND);
    }

    export function create(options: { query: string }): RequestAdvancedSearchAction {
        return {
            kind: KIND,
            requestId: '',
            query: options.query
        };
    }
}

/**
 * Response sent from backend to WebView with search results.
 */
export interface AdvancedSearchActionResponse extends ResponseAction {
    kind: typeof AdvancedSearchActionResponse.KIND;
    results: {
        id: string;
        type: string;
        name: string;
        parentName?: string;
        details?: string;
    }[];
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
            responseId: options?.responseId ?? '',
            results: options?.results ?? []
        };
    }
}
