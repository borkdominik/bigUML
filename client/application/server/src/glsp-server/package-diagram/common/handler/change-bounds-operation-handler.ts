import { inject, injectable } from 'inversify';
import { AbstractChangeBoundsOperationHandler } from '../../../common/handler/abstract-change-bounds-operation-handler.js';
import { PackageDiagramModelState } from '../../model/package-diagram-model-state.js';

@injectable()
export class PackageDiagramChangeBoundsOperationHandler extends AbstractChangeBoundsOperationHandler {
    @inject(PackageDiagramModelState)
    declare modelState: PackageDiagramModelState;
}
