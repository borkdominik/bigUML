/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { Action, type Operation, RequestAction, type ResponseAction } from '@eclipse-glsp/protocol';

/** Value-generation strategy selector (topic feature 4b/4c). */
export type GenerationStrategyKind = 'random' | 'pattern' | 'realistic';

/** Configuration shared by the generation operation (apply) and its preview. */
export interface GenerationConfig {
    /** Classifiers (by `__id`) to instantiate. */
    classifierIds: string[];
    /** How many instances to create per classifier. */
    countPerClassifier: number;
    /** Strategy used to fill slot values. */
    strategy: GenerationStrategyKind;
    /** Pattern strategy config: classifierId -> (property name -> format string, e.g. `User_{n}`). */
    patterns?: Record<string, Record<string, string>>;
    /** How deeply to follow associations (0 = no links, >= 1 = direct associations). */
    associationDepth: number;
    /** Optional `associationId` -> chosen existing target `instanceId` (else automatic target selection). */
    linkTargets?: Record<string, string>;
    /**
     * When true, links connect generated instances only to other instances created in the same
     * batch (not to pre-existing ones) — so generating e.g. Company + Employee + Address yields a
     * self-contained connected cluster instead of linking to existing instances.
     */
    linkWithinBatchOnly?: boolean;
    /** Optional seed for reproducible generation. */
    seed?: number;
}

export interface GenerationDiagnosticSummary {
    code: string;
    severity: 'info' | 'warning' | 'error';
    message: string;
}

export interface PreviewSlotSample {
    feature: string;
    value: string;
}

export interface PreviewInstanceSample {
    name: string;
    classifierName: string;
    slots: PreviewSlotSample[];
}

/** Complete per-classifier instance count (always full, even when the sample is truncated). */
export interface PreviewClassifierCount {
    classifierName: string;
    instanceCount: number;
}

export interface GenerationResultSummary {
    instanceCount: number;
    slotCount: number;
    linkCount: number;
    diagnostics: GenerationDiagnosticSummary[];
    /** Complete count of instances per classifier (the authoritative "what will be created"). */
    perClassifier: PreviewClassifierCount[];
    /** Dry-run **sample** of the instances that would be created — stratified (a few per classifier), truncated. */
    sample: PreviewInstanceSample[];
}

export interface GeneratableProperty {
    name: string;
    typeName?: string;
}

export interface GeneratableClassifier {
    classifierId: string;
    classifierName: string;
    properties: GeneratableProperty[];
}

export interface GeneratableAssociationTarget {
    instanceId: string;
    instanceName: string;
}

/** An association whose source classifier can be generated, with the existing instances available as link targets. */
export interface GeneratableAssociation {
    associationId: string;
    associationName: string;
    /** Every concrete classifier that is the source of this association (directly or via inheritance). */
    sourceClassifierIds: string[];
    targetClassifierId: string;
    targets: GeneratableAssociationTarget[];
}

/** Requests the instantiable classifiers and their (generatable) properties, for the generation UI. */
export interface RequestGeneratableClassifiersAction extends RequestAction<GeneratableClassifiersResponse> {
    kind: typeof RequestGeneratableClassifiersAction.KIND;
}

export namespace RequestGeneratableClassifiersAction {
    export const KIND = 'requestGeneratableClassifiers';

    export function is(object: unknown): object is RequestGeneratableClassifiersAction {
        return RequestAction.hasKind(object, KIND);
    }

    export function create(options: { requestId?: string } = {}): RequestGeneratableClassifiersAction {
        return { kind: KIND, requestId: options.requestId ?? '' };
    }
}

export interface GeneratableClassifiersResponse extends ResponseAction {
    kind: typeof GeneratableClassifiersResponse.KIND;
    classifiers: GeneratableClassifier[];
    associations: GeneratableAssociation[];
}

export namespace GeneratableClassifiersResponse {
    export const KIND = 'generatableClassifiersResponse';

    export function is(object: unknown): object is GeneratableClassifiersResponse {
        return Action.hasKind(object, KIND);
    }

    export function create(
        options?: Omit<GeneratableClassifiersResponse, 'kind' | 'responseId'> & { responseId?: string }
    ): GeneratableClassifiersResponse {
        return {
            kind: KIND,
            responseId: options?.responseId ?? '',
            classifiers: options?.classifiers ?? [],
            associations: options?.associations ?? []
        };
    }
}

/**
 * Apply operation: creates the generated instances/slots/links as a single
 * atomic model change (one undo reverts the whole generation).
 */
export interface GenerateInstancesOperation extends Operation {
    kind: typeof GenerateInstancesOperation.KIND;
    config: GenerationConfig;
}

export namespace GenerateInstancesOperation {
    export const KIND = 'generateInstancesOperation';

    export function is(object: unknown): object is GenerateInstancesOperation {
        return Action.hasKind(object, KIND);
    }

    export function create(config: GenerationConfig): GenerateInstancesOperation {
        return {
            kind: KIND,
            isOperation: true,
            config
        };
    }
}

/** Read-only preview: runs generation in-memory and returns counts + diagnostics, without mutating the model. */
export interface RequestGenerateInstancesPreviewAction extends RequestAction<GenerateInstancesPreviewResponse> {
    kind: typeof RequestGenerateInstancesPreviewAction.KIND;
    config: GenerationConfig;
}

export namespace RequestGenerateInstancesPreviewAction {
    export const KIND = 'requestGenerateInstancesPreview';

    export function is(object: unknown): object is RequestGenerateInstancesPreviewAction {
        return RequestAction.hasKind(object, KIND);
    }

    export function create(options: { config: GenerationConfig; requestId?: string }): RequestGenerateInstancesPreviewAction {
        return {
            kind: KIND,
            requestId: options.requestId ?? '',
            config: options.config
        };
    }
}

export interface GenerateInstancesPreviewResponse extends ResponseAction {
    kind: typeof GenerateInstancesPreviewResponse.KIND;
    summary: GenerationResultSummary;
}

export namespace GenerateInstancesPreviewResponse {
    export const KIND = 'generateInstancesPreviewResponse';

    export function is(object: unknown): object is GenerateInstancesPreviewResponse {
        return Action.hasKind(object, KIND);
    }

    export function create(
        options?: Omit<GenerateInstancesPreviewResponse, 'kind' | 'responseId'> & { responseId?: string }
    ): GenerateInstancesPreviewResponse {
        return {
            kind: KIND,
            responseId: options?.responseId ?? '',
            summary: options?.summary ?? { instanceCount: 0, slotCount: 0, linkCount: 0, diagnostics: [], perClassifier: [], sample: [] }
        };
    }
}
