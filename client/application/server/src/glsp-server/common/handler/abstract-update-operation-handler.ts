/*********************************************************************************
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { Command, OperationHandler } from '@eclipse-glsp/server';
import { injectable } from 'inversify';
import { BigUmlCommand } from '../../biguml/index.js'; // adjust path if your barrel differs
import { BaseDiagramModelState } from '../model/base-diagram-model-state.js';
import { UpdateOperation } from '../operation/update-operation.js';

@injectable()
export abstract class AbstractUpdateOperationHandler extends OperationHandler {
    override operationType = UpdateOperation.KIND;

    abstract override readonly modelState: BaseDiagramModelState;

    override createCommand(op: UpdateOperation): Command | undefined {
        const patch = this.createUpdatePatch(op);
        if (!patch) {
            return undefined;
        }
        return new BigUmlCommand(this.modelState, JSON.stringify([patch]));
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

    /** transform incoming value if needed (default: return as-is). */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected transformValue(operation: UpdateOperation, _element: any): unknown {
        return operation.value;
    }

    /** choose between 'add' and 'replace' (default: always 'replace'). */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected chooseOp(element: any, property: string, _value: unknown): 'add' | 'replace' {
        return 'replace';
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
