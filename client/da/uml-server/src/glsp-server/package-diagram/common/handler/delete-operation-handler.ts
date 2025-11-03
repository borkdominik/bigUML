import { inject, injectable } from 'inversify';
import { AbstractDeleteOperationHandler } from '../../../common/handler/abstract-delete-operation-handler.js';
import { PackageDiagramModelState } from '../../model/package-diagram-model-state.js';

@injectable()
export class PackageDiagramDeleteOperationHandler extends AbstractDeleteOperationHandler {
    @inject(PackageDiagramModelState)
    declare modelState: PackageDiagramModelState;
}
