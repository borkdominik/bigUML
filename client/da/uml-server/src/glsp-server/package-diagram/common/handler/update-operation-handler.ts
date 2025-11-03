import { inject, injectable } from 'inversify';
import { AbstractUpdateOperationHandler } from '../../../common/handler/abstract-update-operation-handler.js';
import { PackageDiagramModelState } from '../../model/package-diagram-model-state.js';

@injectable()
export class PackageDiagramUpdateOperationHandler extends AbstractUpdateOperationHandler {
    @inject(PackageDiagramModelState)
    declare readonly modelState: PackageDiagramModelState;
}
