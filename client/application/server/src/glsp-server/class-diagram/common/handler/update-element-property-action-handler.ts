import { inject, injectable } from 'inversify';
import { AbstractUpdateElementPropertyActionHandler } from '../../../common/handler/abstract-element-property-action-handler.js';
import { ClassDiagramModelState } from '../../model/class-diagram-model-state.js';

@injectable()
export class ClassDiagramUpdateElementPropertyActionHandler extends AbstractUpdateElementPropertyActionHandler {
    @inject(ClassDiagramModelState)
    declare readonly modelState: ClassDiagramModelState;
}
