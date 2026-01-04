/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { Action } from '@eclipse-glsp/protocol';
import type { InteractionEvent } from './interaction-tracking.types.js';

export interface TrackInteractionAction extends Action {
    kind: typeof TrackInteractionAction.KIND;
    event: InteractionEvent;
}

export namespace TrackInteractionAction {
    export const KIND = 'trackInteraction';

    export function is(object: any): object is TrackInteractionAction {
        return Action.hasKind(object, KIND);
    }

    export function create(event: InteractionEvent): TrackInteractionAction {
        return {
            kind: KIND,
            event
        };
    }
}

export interface StartTrackingSessionAction extends Action {
    kind: typeof StartTrackingSessionAction.KIND;
    sessionId?: string;
}

export namespace StartTrackingSessionAction {
    export const KIND = 'startTrackingSession';

    export function is(object: any): object is StartTrackingSessionAction {
        return Action.hasKind(object, KIND);
    }

    export function create(sessionId?: string): StartTrackingSessionAction {
        return {
            kind: KIND,
            sessionId
        };
    }
}

export interface StopTrackingSessionAction extends Action {
    kind: typeof StopTrackingSessionAction.KIND;
}

export namespace StopTrackingSessionAction {
    export const KIND = 'stopTrackingSession';

    export function is(object: any): object is StopTrackingSessionAction {
        return Action.hasKind(object, KIND);
    }

    export function create(): StopTrackingSessionAction {
        return {
            kind: KIND
        };
    }
}

export interface ExportInteractionDataAction extends Action {
    kind: typeof ExportInteractionDataAction.KIND;
}

export namespace ExportInteractionDataAction {
    export const KIND = 'exportInteractionData';

    export function is(object: any): object is ExportInteractionDataAction {
        return Action.hasKind(object, KIND);
    }

    export function create(): ExportInteractionDataAction {
        return {
            kind: KIND
        };
    }
}

/**
 * Action sent from GLSP client to VSCode extension when viewport changes
 * Contains the actual viewport state (scroll position and zoom level)
 */
export interface ViewportTrackingAction extends Action {
    kind: typeof ViewportTrackingAction.KIND;
    scroll: { x: number; y: number };
    zoom: number;
    canvasBounds?: { x: number; y: number; width: number; height: number };
}

export namespace ViewportTrackingAction {
    export const KIND = 'viewportTracking';

    export function is(object: any): object is ViewportTrackingAction {
        return Action.hasKind(object, KIND);
    }

    export function create(
        scroll: { x: number; y: number },
        zoom: number,
        canvasBounds?: { x: number; y: number; width: number; height: number }
    ): ViewportTrackingAction {
        return {
            kind: KIND,
            scroll,
            zoom,
            canvasBounds
        };
    }
}

/**
 * Action to open the standalone eye tracking demo in the default browser
 */
export interface OpenStandaloneEyeTrackingAction extends Action {
    kind: typeof OpenStandaloneEyeTrackingAction.KIND;
}

export namespace OpenStandaloneEyeTrackingAction {
    export const KIND = 'openStandaloneEyeTracking';

    export function is(object: any): object is OpenStandaloneEyeTrackingAction {
        return Action.hasKind(object, KIND);
    }

    export function create(): OpenStandaloneEyeTrackingAction {
        return {
            kind: KIND
        };
    }
}

/**
 * Status action sent from extension to webview to establish connection and provide status
 */
export interface InteractionTrackingStatusAction extends Action {
    kind: typeof InteractionTrackingStatusAction.KIND;
    isSessionActive: boolean;
    message?: string;
}

export namespace InteractionTrackingStatusAction {
    export const KIND = 'interactionTrackingStatus';

    export function is(object: any): object is InteractionTrackingStatusAction {
        return Action.hasKind(object, KIND);
    }

    export function create(options: Omit<InteractionTrackingStatusAction, 'kind'>): InteractionTrackingStatusAction {
        return {
            kind: KIND,
            ...options
        };
    }
}
