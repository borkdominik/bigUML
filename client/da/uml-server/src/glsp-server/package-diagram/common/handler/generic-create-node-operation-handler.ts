import { inject, injectable } from 'inversify';
import { AbstractCreateEdgeOperationHandler } from '../../../common/handler/abstract-create-edge-operation-handler.js';
import { PackageDiagramModelState } from '../../model/package-diagram-model-state.js';
import { ModelTypes } from '../util/model-types.js';

@injectable()
export class PackageCreateNodeOperationHandler extends AbstractCreateEdgeOperationHandler {
    readonly elementTypeIds = [ModelTypes.CLASS, ModelTypes.PACKAGE];

    @inject(PackageDiagramModelState)
    declare modelState: PackageDiagramModelState;
}
