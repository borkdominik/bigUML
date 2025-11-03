import { inject, injectable } from 'inversify';
import { AbstractUpdateElementPropertyActionHandler } from '../../../common/handler/abstract-element-property-action-handler.js';
import { PackageDiagramModelState } from '../../model/package-diagram-model-state.js';

@injectable()
export class PackageDiagramUpdateElementPropertyActionHandler extends AbstractUpdateElementPropertyActionHandler {
    @inject(PackageDiagramModelState)
    declare readonly modelState: PackageDiagramModelState;
}
