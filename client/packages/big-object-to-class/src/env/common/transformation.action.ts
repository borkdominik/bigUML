/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { Action, RequestAction, type ResponseAction } from '@eclipse-glsp/protocol';

const generateId = () => 'id_' + Math.random().toString(36).substring(2, 15);

/**
 * Request from VSCode → GLSP server to parse mock data and return the
 * inferred transformation result (for preview).
 */
export interface RequestTransformationPreviewAction extends RequestAction<TransformationPreviewResponse> {
    kind: typeof RequestTransformationPreviewAction.KIND;
    mockData: string;
}

export namespace RequestTransformationPreviewAction {
    export const KIND = 'requestTransformationPreview';

    export function is(object: unknown): object is RequestTransformationPreviewAction {
        return RequestAction.hasKind(object, KIND);
    }

    export function create(options: Omit<RequestTransformationPreviewAction, 'kind' | 'requestId'>): RequestTransformationPreviewAction {
        return { kind: KIND, requestId: generateId(), ...options };
    }
}

/**
 * Response from GLSP server back to VSCode with the inferred result and patches.
 * If `applyImmediately` was requested, the patches have already been applied.
 */
export interface TransformationPreviewResponse extends ResponseAction {
    kind: typeof TransformationPreviewResponse.KIND;
    success: boolean;
    classes: InferredClassPreview[];
    associations: InferredAssociationPreview[];
    conflicts: ConflictPreview[];
    message?: string;
}

export interface InferredClassPreview {
    name: string;
    properties: { name: string; type: string; isOptional: boolean }[];
}

export interface InferredAssociationPreview {
    name: string;
    sourceTypeName: string;
    targetTypeName: string;
    sourceMultiplicity: string;
    targetMultiplicity: string;
}

export interface ConflictPreview {
    kind: 'type_conflict' | 'name_ambiguity';
    message: string;
    conflictingNames?: string[];
}

export namespace TransformationPreviewResponse {
    export const KIND = 'transformationPreviewResponse';

    export function is(object: unknown): object is TransformationPreviewResponse {
        return Action.hasKind(object, KIND);
    }

    export function create(
        options: Omit<TransformationPreviewResponse, 'kind' | 'responseId'> & { responseId?: string }
    ): TransformationPreviewResponse {
        return { kind: KIND, responseId: '', ...options };
    }
}

/**
 * Request from VSCode → GLSP server to apply the transformation patches
 * to the current model.
 */
export interface ApplyTransformationAction extends RequestAction<ApplyTransformationResponse> {
    kind: typeof ApplyTransformationAction.KIND;
    mockData: string;
}

export namespace ApplyTransformationAction {
    export const KIND = 'applyTransformation';

    export function is(object: unknown): object is ApplyTransformationAction {
        return RequestAction.hasKind(object, KIND);
    }

    export function create(options: Omit<ApplyTransformationAction, 'kind' | 'requestId'>): ApplyTransformationAction {
        return { kind: KIND, requestId: generateId(), ...options };
    }
}

export interface ApplyTransformationResponse extends ResponseAction {
    kind: typeof ApplyTransformationResponse.KIND;
    success: boolean;
    message?: string;
}

export namespace ApplyTransformationResponse {
    export const KIND = 'applyTransformationResponse';

    export function is(object: unknown): object is ApplyTransformationResponse {
        return Action.hasKind(object, KIND);
    }

    export function create(
        options: Omit<ApplyTransformationResponse, 'kind' | 'responseId'> & { responseId?: string }
    ): ApplyTransformationResponse {
        return { kind: KIND, responseId: '', message: '', ...options };
    }
}

/**
 * Request from VSCode → GLSP server to apply a batch of JSON patches
 * to the current model via PatchManager.
 */
export interface RequestApplyModelPatchAction extends RequestAction<ApplyModelPatchResponse> {
    kind: typeof RequestApplyModelPatchAction.KIND;
    patches: string;
}

export namespace RequestApplyModelPatchAction {
    export const KIND = 'requestApplyModelPatch';

    export function is(object: unknown): object is RequestApplyModelPatchAction {
        return RequestAction.hasKind(object, KIND);
    }

    export function create(options: Omit<RequestApplyModelPatchAction, 'kind' | 'requestId'>): RequestApplyModelPatchAction {
        return { kind: KIND, requestId: generateId(), ...options };
    }
}

/**
 * Response from GLSP server confirming model patch was applied.
 */
export interface ApplyModelPatchResponse extends ResponseAction {
    kind: typeof ApplyModelPatchResponse.KIND;
    success: boolean;
    message?: string;
}

export namespace ApplyModelPatchResponse {
    export const KIND = 'applyModelPatchResponse';

    export function is(object: unknown): object is ApplyModelPatchResponse {
        return Action.hasKind(object, KIND);
    }

    export function create(
        options: Omit<ApplyModelPatchResponse, 'kind' | 'responseId'> & { responseId?: string }
    ): ApplyModelPatchResponse {
        return { kind: KIND, responseId: '', ...options };
    }
}
