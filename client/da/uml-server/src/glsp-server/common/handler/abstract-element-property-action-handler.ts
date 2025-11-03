import { UpdateElementPropertyAction } from '@borkdominik-biguml/biguml-protocol';
import { ActionHandler, MaybePromise, Operation } from '@eclipse-glsp/server';
import { injectable } from 'inversify';
import { BaseDiagramModelState } from '../model/base-diagram-model-state.js';
import { UpdateOperation } from '../operation/update-operation.js';

@injectable()
export abstract class AbstractUpdateElementPropertyActionHandler implements ActionHandler {
    actionKinds = [UpdateElementPropertyAction.KIND];

    abstract readonly modelState: BaseDiagramModelState;

    execute(action: UpdateElementPropertyAction): MaybePromise<Operation[]> {
        if (!action.elementId) {
            return [];
        }

        const semanticElement = this.modelState.index.findIdElement(action.elementId);
        if (!semanticElement) {
            return [];
        }

        return [UpdateOperation.create(action.elementId, action.propertyId, action.value)];
    }
}
