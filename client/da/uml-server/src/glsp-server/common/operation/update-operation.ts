// src/glsp-server/common/operation/update-operation.ts
import { Operation } from '@eclipse-glsp/protocol';

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
