/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/
import { Operation } from '@eclipse-glsp/protocol';
import { Command, OperationHandler } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { BigUmlCommand } from '../../../biguml/common/handler/big-uml-command.js';
import { ClassDiagramModelState } from '../../model/class-diagram-model-state.js';

@injectable()
export class ClassDiagramUpdateClientOperationHandler extends OperationHandler {
  override operationType = UpdateClientOperation.KIND;

  @inject(ClassDiagramModelState) protected state: ClassDiagramModelState;

  createCommand(_operation: UpdateClientOperation): Command {
    return new BigUmlCommand(this.state);
  }
}

export interface UpdateClientOperation extends Operation {
  kind: typeof UpdateClientOperation.KIND;
  doNotUpdateSemanticRoot: boolean;
  doNotUpdateSemanticRootDetails: boolean;
}

export namespace UpdateClientOperation {
  export const KIND = 'classDiagramUpdateClientOperation';

  export function is(object: any): object is UpdateClientOperation {
    return Operation.hasKind(object, KIND);
  }

  export function create(
    doNotUpdateSemanticRoot: boolean,
    doNotUpdateSemanticRootDetails: boolean
  ): UpdateClientOperation {
    return {
      kind: KIND,
      isOperation: true,
      doNotUpdateSemanticRoot,
      doNotUpdateSemanticRootDetails
    };
  }
}
