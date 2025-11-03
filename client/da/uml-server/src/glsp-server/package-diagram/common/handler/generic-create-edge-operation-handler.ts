import { inject, injectable } from 'inversify';
import { AbstractCreateEdgeOperationHandler } from '../../../common/handler/abstract-create-edge-operation-handler.js';
import { PackageDiagramModelState } from '../../model/package-diagram-model-state.js';
import { ModelTypes } from '../util/model-types.js';

@injectable()
export class PackageCreateEdgeOperationHandler extends AbstractCreateEdgeOperationHandler {
    readonly elementTypeIds = [
        ModelTypes.ABSTRACTION,
        ModelTypes.DEPENDENCY,
        ModelTypes.ELEMENT_IMPORT,
        ModelTypes.PACKAGE_IMPORT,
        ModelTypes.PACKAGE_MERGE,
        ModelTypes.USAGE
    ];

    @inject(PackageDiagramModelState)
    declare modelState: PackageDiagramModelState;
}
