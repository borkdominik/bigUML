/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { UpdateOperation } from '@borkdominik-biguml/uml-glsp-server';
import { type Command, OperationHandler } from '@eclipse-glsp/server';
import { injectable } from 'inversify';
import { ModelPatchCommand } from '../../command/model-patch-command.js';
import { type DiagramModelState } from '../../model/diagram-model-state.js';

@injectable()
export class GenericUpdateOperationHandler extends OperationHandler {
    override operationType = UpdateOperation.KIND;

    declare modelState: DiagramModelState;

    override createCommand(op: UpdateOperation): Command | undefined {
        const patch = this.createUpdatePatch(op);
        if (!patch) {
            return undefined;
        }
        return new ModelPatchCommand(this.modelState, JSON.stringify([patch]));
    }

    protected createUpdatePatch(operation: UpdateOperation): { op: 'add' | 'replace'; path: string; value: unknown } | undefined {
        const basePath = this.modelState.index.findPath(operation.elementId);
        if (!basePath) {
            return undefined;
        }

        const element = this.modelState.index.findIdElement(operation.elementId);
        const value = this.transformValue(operation, element);
        const opKind = this.chooseOp(element, operation.property, value);

        return {
            op: opKind,
            path: `${basePath}/${operation.property}`,
            value
        };
    }

    protected transformValue(operation: UpdateOperation, _element: any): unknown {
        const raw = operation.value;
        if (typeof raw === 'string' && raw.endsWith('_refValue')) {
            // TODO: When does this happen?
            const refId = raw.slice(0, -'_refValue'.length);
            const target = this.modelState.index.findIdElement(refId);
            if (!target) return raw; // fallback: leave as-is
            return {
                ref: {
                    __id: target.__id,
                    __documentUri: target.$document?.uri
                }
            };
        }
        return smartCast(raw);
    }

    /** choose between 'add' and 'replace' (default: always 'replace'). */

    protected chooseOp(element: any, property: string, _value: unknown): 'add' | 'replace' {
        return element && element[property] ? 'replace' : 'add';
    }
}

export function smartCast(value: unknown): unknown {
    if (typeof value !== 'string') return value;
    const trimmed = value.trim().toLowerCase();
    if (trimmed === 'true') return true;
    if (trimmed === 'false') return false;
    const asNum = Number(trimmed);
    if (!Number.isNaN(asNum) && trimmed !== '') return asNum;
    return value;
}
