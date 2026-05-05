/*********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { Action, RequestAction, type ResponseAction } from '@eclipse-glsp/protocol';

export interface RequestHighlightElementAction extends RequestAction<HighlightElementActionResponse> {
    kind: typeof RequestHighlightElementAction.KIND;
    semanticUri: string;
}

export namespace RequestHighlightElementAction {
    export const KIND = 'requestHighlightElement';

    export function is(obj: unknown): obj is RequestHighlightElementAction {
        return RequestAction.hasKind(obj, KIND);
    }

    export function create(opts: { semanticUri: string }): RequestHighlightElementAction {
        return {
            kind: KIND,
            requestId: '',
            semanticUri: opts.semanticUri
        };
    }
}

export interface HighlightElementActionResponse extends ResponseAction {
    kind: typeof HighlightElementActionResponse.KIND;
    ok: boolean;
}

export namespace HighlightElementActionResponse {
    export const KIND = 'highlightElementResponse';

    export function is(obj: unknown): obj is HighlightElementActionResponse {
        return Action.hasKind(obj, KIND);
    }

    export function create(opts?: { ok?: boolean; responseId?: string }): HighlightElementActionResponse {
        return {
            kind: KIND,
            responseId: opts?.responseId ?? '',
            ok: opts?.ok ?? true
        };
    }
}
