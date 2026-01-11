/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { inject, injectable } from 'inversify';
import { type UpdateOperation } from '../../../../../common/operations/update-operation.js';
import { AbstractUpdateOperationHandler, smartCast } from '../../../../features/mutation/handler/abstract-update-operation-handler.js';
import { ClassDiagramModelState } from '../../model/class-diagram-model-state.js';

// TODO: Haydar

@injectable()
export class ClassDiagramUpdateOperationHandler extends AbstractUpdateOperationHandler {
    @inject(ClassDiagramModelState)
    declare readonly modelState: ClassDiagramModelState;

    /** class-specific: convert "*_refValue" markers to proper { ref: { __id, __documentUri } } or smart-cast primitives */
    protected override transformValue(operation: UpdateOperation, _element: any): unknown {
        const raw = operation.value;
        if (typeof raw === 'string' && raw.endsWith('_refValue')) {
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

    /** class-specific: add vs replace depending on whether the property exists */
    protected override chooseOp(element: any, property: string, _value: unknown): 'add' | 'replace' {
        return element && element[property] ? 'replace' : 'add';
    }
}
