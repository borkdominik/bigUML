/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/
import { Operation } from '@eclipse-glsp/protocol';
import { Command, OperationHandler } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { BigUmlCommand } from '../../../biguml/common/handler/big-uml-command.js';
import { PackageDiagramModelState } from '../../model/package-diagram-model-state.js';

@injectable()
export class UpdateOperationHandler extends OperationHandler {
    override operationType = UpdateOperation.KIND;

    @inject(PackageDiagramModelState) protected state: PackageDiagramModelState;

    createCommand(_operation: UpdateOperation): Command {
        return new BigUmlCommand(this.state, JSON.stringify([JSON.parse(this.createUpdate(_operation))]));
    }

    @inject(PackageDiagramModelState)
    declare modelState: PackageDiagramModelState;

    createUpdate(operation: UpdateOperation): string {
        const path = this.state.index.findPath(operation.elementId);
        return JSON.stringify({
            op: 'replace',
            path: path + '/' + operation.property,
            value: operation.value
        });
    }
}

export interface UpdateOperation extends Operation {
    kind: typeof UpdateOperation.KIND;
    elementId: string;
    property: string;
    value: string | number | boolean;
}

export namespace UpdateOperation {
    export const KIND = 'UpdateOperation';

    export function is(object: any): object is UpdateOperation {
        return Operation.hasKind(object, KIND);
    }

    export function create(elementId: string, property: string, value: string | number | boolean): UpdateOperation {
        return {
            kind: KIND,
            isOperation: true,
            elementId,
            property,
            value
        };
    }
}
