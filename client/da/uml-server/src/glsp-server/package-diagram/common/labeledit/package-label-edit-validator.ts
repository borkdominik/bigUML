import { inject, injectable } from 'inversify';
import { AbstractLabelEditValidator } from '../../../common/labeledit/abstract-label-edit-validator.js';
import { GPackageClassNode } from '../../model/elements/class.graph-extension.js';
import { PackageDiagramModelState } from '../../model/package-diagram-model-state.js';

@injectable()
export class PackageLabelEditValidator extends AbstractLabelEditValidator<GPackageClassNode> {
    @inject(PackageDiagramModelState)
    declare readonly modelState: PackageDiagramModelState;

    protected getTargetNodeClass() {
        return GPackageClassNode;
    }
}
