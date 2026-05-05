/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { type Operation } from '@eclipse-glsp/protocol';

export type UpdatePrimitive = string | number | boolean;

export interface UpdateOperation extends Operation {
    kind: typeof UpdateOperation.KIND;
    elementId: string;
    property: string;
    value: UpdatePrimitive;
}

export namespace UpdateOperation {
    export const KIND = 'UpdateOperation';
    export function create(elementId: string, property: string, value: UpdatePrimitive): UpdateOperation {
        return { kind: KIND, isOperation: true, elementId, property, value };
    }
}
