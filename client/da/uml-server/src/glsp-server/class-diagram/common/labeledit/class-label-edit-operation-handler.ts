import { inject, injectable } from 'inversify';
import { AbstractLabelEditOperationHandler } from '../../../common/labeledit/abstract-label-edit-operation-handler.js';
import { ClassDiagramModelState } from '../../model/class-diagram-model-state.js';

@injectable()
export class ClassLabelEditOperationHandler extends AbstractLabelEditOperationHandler {
    @inject(ClassDiagramModelState)
    declare readonly modelState: ClassDiagramModelState;
}
