import { inject, injectable } from 'inversify';
import { AbstractLabelEditOperationHandler } from '../../../common/labeledit/abstract-label-edit-operation-handler.js';
import { PackageDiagramModelState } from '../../model/package-diagram-model-state.js';

@injectable()
export class PackageLabelEditOperationHandler extends AbstractLabelEditOperationHandler {
    @inject(PackageDiagramModelState)
    declare readonly modelState: PackageDiagramModelState;
}
