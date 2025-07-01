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

export interface RequestEyeTrackingAction extends RequestAction<EyeTrackingActionResponse> {
    kind: typeof RequestEyeTrackingAction.KIND;
    increase: number;
}

export namespace RequestEyeTrackingAction {
    export const KIND = 'requestEyeTracking';

    export function is(object: unknown): object is RequestEyeTrackingAction {
        return RequestAction.hasKind(object, KIND);
    }

    export function create(options: Omit<RequestEyeTrackingAction, 'kind' | 'requestId'>): RequestEyeTrackingAction {
        return {
            kind: KIND,
            requestId: '',
            ...options
        };
    }
}

export interface EyeTrackingActionResponse extends ResponseAction {
    kind: typeof EyeTrackingActionResponse.KIND;
    count: number;
}
export namespace EyeTrackingActionResponse {
    export const KIND = 'eyeTrackingResponse';

    export function is(object: unknown): object is EyeTrackingActionResponse {
        return Action.hasKind(object, KIND);
    }

    export function create(
        options?: Omit<EyeTrackingActionResponse, 'kind' | 'responseId'> & { responseId?: string }
    ): EyeTrackingActionResponse {
        return {
            kind: KIND,
            responseId: '',
            count: 0,
            ...options
        };
    }
}
