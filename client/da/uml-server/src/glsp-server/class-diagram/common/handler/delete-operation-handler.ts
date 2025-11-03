import { inject, injectable } from 'inversify';
import { AbstractDeleteOperationHandler } from '../../../common/handler/abstract-delete-operation-handler.js';
import { ClassDiagramModelState } from '../../model/class-diagram-model-state.js';

@injectable()
export class ClassDiagramDeleteOperationHandler extends AbstractDeleteOperationHandler {
    @inject(ClassDiagramModelState)
    declare modelState: ClassDiagramModelState;
}
