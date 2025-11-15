/********************************************************************************
 * Class-specific LabelEditValidator
 ********************************************************************************/
import { inject, injectable } from 'inversify';
import { AbstractLabelEditValidator } from '../../../common/labeledit/abstract-label-edit-validator.js';
import { ClassDiagramModelState } from '../../model/class-diagram-model-state.js';
import { GClassNode } from '../../model/elements/class.graph-extension.js';

@injectable()
export class ClassLabelEditValidator extends AbstractLabelEditValidator<GClassNode> {
    @inject(ClassDiagramModelState)
    declare readonly modelState: ClassDiagramModelState;

    protected getTargetNodeClass() {
        return GClassNode;
    }
}
