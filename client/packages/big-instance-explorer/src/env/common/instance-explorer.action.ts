/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { Action, type Operation, RequestAction, type ResponseAction } from '@eclipse-glsp/protocol';

export type ClassifierType = 'Class' | 'Interface' | 'DataType';
export type DiagnosticSeverity = 'info' | 'warning';

export interface DiagnosticSummary {
    severity: DiagnosticSeverity;
    message: string;
}

export interface SlotSummary {
    id: string;
    featureName: string;
    values: string[];
    diagnostics: DiagnosticSummary[];
}

export interface EligibleInstance {
    id: string;
    name: string;
    classifierName?: string;
}

export interface InstanceLinkSummary {
    id: string;
    relationName: string;
    direction: 'outgoing' | 'incoming';
    peerInstanceId: string;
    peerInstanceName: string;
    peerClassifierName?: string;
    peerEnd: 'source' | 'target';
    eligiblePeers: EligibleInstance[];
}

export interface AvailableInstanceLink {
    associationId: string;
    associationName: string;
    end: 'source' | 'target';
    direction: 'outgoing' | 'incoming';
    eligiblePeers: EligibleInstance[];
}

export interface InstanceSummary {
    id: string;
    name: string;
    classifierId?: string;
    classifierName?: string;
    slots: SlotSummary[];
    links: InstanceLinkSummary[];
    availableLinks: AvailableInstanceLink[];
    diagnostics: DiagnosticSummary[];
}

export interface ClassifierGroup {
    classifierId: string;
    classifierName: string;
    classifierType: ClassifierType;
    isInstantiable: boolean;
    instances: InstanceSummary[];
}

export interface ManyToManyLink {
    id: string;
    sourceInstanceId: string;
    sourceInstanceName: string;
    sourceClassifierName?: string;
    targetInstanceId: string;
    targetInstanceName: string;
    targetClassifierName?: string;
    eligibleSources: EligibleInstance[];
    eligibleTargets: EligibleInstance[];
}

export interface ManyToManyRelationSection {
    id: string;
    name: string;
    relationType: string;
    links: ManyToManyLink[];
    eligibleSources: EligibleInstance[];
    eligibleTargets: EligibleInstance[];
}

export interface AvailableClassifier {
    classifierId: string;
    classifierName: string;
    classifierType: ClassifierType;
}

export interface AvailableAssociation {
    associationId: string;
    associationName: string;
    relationType: string;
    eligibleSources: EligibleInstance[];
    eligibleTargets: EligibleInstance[];
}

export interface AvailableForInstantiation {
    classifiers: AvailableClassifier[];
    associations: AvailableAssociation[];
}

export interface RequestInstanceExplorerDataAction extends RequestAction<InstanceExplorerDataResponse> {
    kind: typeof RequestInstanceExplorerDataAction.KIND;
}

export namespace RequestInstanceExplorerDataAction {
    export const KIND = 'requestInstanceExplorerData';

    export function is(object: unknown): object is RequestInstanceExplorerDataAction {
        return RequestAction.hasKind(object, KIND);
    }

    export function create(options: { requestId?: string } = {}): RequestInstanceExplorerDataAction {
        return {
            kind: KIND,
            requestId: '',
            ...options
        };
    }
}

export interface InstanceExplorerDataResponse extends ResponseAction {
    kind: typeof InstanceExplorerDataResponse.KIND;
    classifierGroups: ClassifierGroup[];
    unclassified: InstanceSummary[];
    manyToManyRelations: ManyToManyRelationSection[];
    availableForInstantiation: AvailableForInstantiation;
}

export namespace InstanceExplorerDataResponse {
    export const KIND = 'instanceExplorerDataResponse';

    export function is(object: unknown): object is InstanceExplorerDataResponse {
        return Action.hasKind(object, KIND);
    }

    export function create(
        options?: Omit<InstanceExplorerDataResponse, 'kind' | 'responseId'> & { responseId?: string }
    ): InstanceExplorerDataResponse {
        return {
            kind: KIND,
            responseId: options?.responseId ?? '',
            classifierGroups: options?.classifierGroups ?? [],
            unclassified: options?.unclassified ?? [],
            manyToManyRelations: options?.manyToManyRelations ?? [],
            availableForInstantiation: options?.availableForInstantiation ?? { classifiers: [], associations: [] }
        };
    }
}

export interface CreateClassifierInstanceOperation extends Operation {
    kind: typeof CreateClassifierInstanceOperation.KIND;
    classifierId: string;
}

export namespace CreateClassifierInstanceOperation {
    export const KIND = 'createClassifierInstanceOperation';

    export function is(object: unknown): object is CreateClassifierInstanceOperation {
        return Action.hasKind(object, KIND);
    }

    export function create(options: { classifierId: string }): CreateClassifierInstanceOperation {
        return {
            kind: KIND,
            isOperation: true,
            classifierId: options.classifierId
        };
    }
}

export interface UpdateInstanceSlotValuesOperation extends Operation {
    kind: typeof UpdateInstanceSlotValuesOperation.KIND;
    slotId: string;
    values: string[];
}

export namespace UpdateInstanceSlotValuesOperation {
    export const KIND = 'updateInstanceSlotValuesOperation';

    export function is(object: unknown): object is UpdateInstanceSlotValuesOperation {
        return Action.hasKind(object, KIND);
    }

    export function create(options: { slotId: string; values: string[] }): UpdateInstanceSlotValuesOperation {
        return {
            kind: KIND,
            isOperation: true,
            slotId: options.slotId,
            values: options.values
        };
    }
}

export interface UpdateInstanceLinkEndOperation extends Operation {
    kind: typeof UpdateInstanceLinkEndOperation.KIND;
    linkId: string;
    end: 'source' | 'target';
    newInstanceId: string;
}

export namespace UpdateInstanceLinkEndOperation {
    export const KIND = 'updateInstanceLinkEndOperation';

    export function is(object: unknown): object is UpdateInstanceLinkEndOperation {
        return Action.hasKind(object, KIND);
    }

    export function create(options: { linkId: string; end: 'source' | 'target'; newInstanceId: string }): UpdateInstanceLinkEndOperation {
        return {
            kind: KIND,
            isOperation: true,
            linkId: options.linkId,
            end: options.end,
            newInstanceId: options.newInstanceId
        };
    }
}

export interface CreateInstanceLinkOperation extends Operation {
    kind: typeof CreateInstanceLinkOperation.KIND;
    associationId: string;
    sourceInstanceId: string;
    targetInstanceId: string;
}

export namespace CreateInstanceLinkOperation {
    export const KIND = 'createInstanceLinkOperation';

    export function is(object: unknown): object is CreateInstanceLinkOperation {
        return Action.hasKind(object, KIND);
    }

    export function create(options: {
        associationId: string;
        sourceInstanceId: string;
        targetInstanceId: string;
    }): CreateInstanceLinkOperation {
        return {
            kind: KIND,
            isOperation: true,
            associationId: options.associationId,
            sourceInstanceId: options.sourceInstanceId,
            targetInstanceId: options.targetInstanceId
        };
    }
}
