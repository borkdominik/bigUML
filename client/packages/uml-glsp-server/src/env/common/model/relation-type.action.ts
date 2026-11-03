/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { Action, hasArrayProp, hasStringProp, RequestAction, type ResponseAction } from '@eclipse-glsp/protocol';

/** A relation a diagram offers, as the "Create relation" tool lists it. */
export interface RelationType {
    /** The edge type id the relation is created as - what `CreateEdgeOperation.elementTypeId` takes. */
    elementTypeId: string;
    label: string;
    /** The CSS icon class, as a palette entry carries it. */
    icon: string;
}

/**
 * Asks for the relations of the loaded diagram that may run from `sourceElementId` - and to
 * `targetElementId`, where one is given. Either end may be a connection point or the centre dot of an
 * edge, as the edge creation tool reports them.
 */
export interface RequestRelationTypesAction extends RequestAction<RelationTypesResponseAction> {
    kind: typeof RequestRelationTypesAction.KIND;
    sourceElementId: string;
    targetElementId?: string;
}

export namespace RequestRelationTypesAction {
    export const KIND = 'requestRelationTypes';

    export function is(object: unknown): object is RequestRelationTypesAction {
        return RequestAction.hasKind(object, KIND) && hasStringProp(object, 'sourceElementId');
    }

    export function create(options: { sourceElementId: string; targetElementId?: string }): RequestRelationTypesAction {
        return { kind: KIND, requestId: RequestAction.generateRequestId(), ...options };
    }
}

/** The relations that may run between the ends asked about - none where no relation can. */
export interface RelationTypesResponseAction extends ResponseAction {
    kind: typeof RelationTypesResponseAction.KIND;
    relationTypes: RelationType[];
}

export namespace RelationTypesResponseAction {
    export const KIND = 'relationTypesResponse';

    export function is(object: unknown): object is RelationTypesResponseAction {
        return Action.hasKind(object, KIND) && hasArrayProp(object, 'relationTypes');
    }

    export function create(relationTypes: RelationType[], responseId = ''): RelationTypesResponseAction {
        return { kind: KIND, responseId, relationTypes };
    }
}
