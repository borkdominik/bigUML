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

export interface StartEyeTrackingAction extends Action {
    kind: typeof StartEyeTrackingAction.KIND;
}

export namespace StartEyeTrackingAction {
    export const KIND = 'startEyeTracking';

    export function is(object: unknown): object is StartEyeTrackingAction {
        return Action.hasKind(object, KIND);
    }

    export function create(): StartEyeTrackingAction {
        return {
            kind: KIND
        };
    }
}


export interface StopEyeTrackingAction extends Action {
    kind: typeof StopEyeTrackingAction.KIND;
}

export namespace StopEyeTrackingAction {
    export const KIND = 'stopEyeTracking';

    export function is(object: unknown): object is StopEyeTrackingAction {
        return Action.hasKind(object, KIND);
    }

    export function create(): StopEyeTrackingAction {
        return {
            kind: KIND
        };
    }
}


export interface EyeTrackingStatusAction extends Action {
    kind: typeof EyeTrackingStatusAction.KIND;
    isActive: boolean;
    isWebGazerLoaded: boolean;
    message?: string;
}

export namespace EyeTrackingStatusAction {
    export const KIND = 'eyeTrackingStatus';

    export function is(object: unknown): object is EyeTrackingStatusAction {
        return Action.hasKind(object, KIND);
    }

    export function create(options: Omit<EyeTrackingStatusAction, 'kind'>): EyeTrackingStatusAction {
        return {
            kind: KIND,
            ...options
        };
    }
}


export interface EyeTrackingDataAction extends Action {
    kind: typeof EyeTrackingDataAction.KIND;
    gazePoints: Array<{x: number, y: number, timestamp: number}>;
}

export namespace EyeTrackingDataAction {
    export const KIND = 'eyeTrackingData';

    export function is(object: unknown): object is EyeTrackingDataAction {
        return Action.hasKind(object, KIND);
    }

    export function create(gazePoints: Array<{x: number, y: number, timestamp: number}>): EyeTrackingDataAction {
        return {
            kind: KIND,
            gazePoints
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
