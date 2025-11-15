import { inject, injectable } from 'inversify';
import { AbstractChangeBoundsOperationHandler } from '../../../common/handler/abstract-change-bounds-operation-handler.js';
import { ClassDiagramModelState } from '../../model/class-diagram-model-state.js';

@injectable()
export class ClassDiagramChangeBoundsOperationHandler extends AbstractChangeBoundsOperationHandler {
    @inject(ClassDiagramModelState)
    declare modelState: ClassDiagramModelState;
}
