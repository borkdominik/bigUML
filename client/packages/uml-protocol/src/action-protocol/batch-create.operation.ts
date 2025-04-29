/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { hasStringProp, RequestAction, type Action, type CreateOperation, type Operation } from '@eclipse-glsp/protocol';

export interface BatchCreateOperation extends Operation {
    operations: BatchOperation[];
}

export namespace BatchCreateOperation {
    export const KIND = 'batchCreate';

    export function is(object: any): object is BatchCreateOperation {
        return RequestAction.hasKind(object, KIND);
    }

    export function create(operations: BatchOperation[]): BatchCreateOperation {
        return {
            kind: KIND,
            isOperation: true,
            operations
        };
    }
}

export type TempCreationId = `temp_${string}`;

/**
 * Represents a single operation in a batch create operation.
 * If a `tempCreationId` is provided, then that id may be used to refer to the created element in subsequent/following operations.
 * If no `tempCreationId` is provided, then the created element can not be referenced in subsequent update actions.
 *
 * Update actions may refer to the created element by its `tempCreationId` or by its `elementId` if it already exists.
 */
export interface BatchOperation {
    tempCreationId?: TempCreationId;
    createOperation?: CreateOperation;
    updateActions?: UpdateElementPropertyAction[];
}

// TODO: Copied from property palette, should be moved to a common place

export interface UpdateElementPropertyAction extends Action {
    kind: typeof UpdateElementPropertyAction.KIND;
    /**
     * The ID of the element whose property should be updated.
     */
    elementId: string;
    /**
     * The ID of the property to be updated.
     */
    propertyId: string;
    /**
     * The new value of the property.
     */
    value: string;
}

export namespace UpdateElementPropertyAction {
    export const KIND = 'updateElementProperty';

    export function is(object: any): object is UpdateElementPropertyAction {
        return (
            RequestAction.hasKind(object, KIND) &&
            hasStringProp(object, 'elementId') &&
            hasStringProp(object, 'propertyId') &&
            hasStringProp(object, 'value')
        );
    }

    export function create(options: { elementId: string; propertyId: string; value: string }): UpdateElementPropertyAction {
        return {
            kind: KIND,
            ...options
        };
    }
}
