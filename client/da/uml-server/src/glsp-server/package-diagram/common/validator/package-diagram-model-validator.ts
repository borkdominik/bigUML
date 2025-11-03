import { GModelElement } from '@eclipse-glsp/server';
import { injectable } from 'inversify';
import { AbstractDiagramModelValidator } from '../../../common/validator/abstract-diagram-model-validator.js';
import { GPackageClassNode } from '../../model/elements/class.graph-extension.js';

@injectable()
export class PackageDiagramModelValidator extends AbstractDiagramModelValidator<GPackageClassNode> {
    protected isTargetNode(element: GModelElement): element is GPackageClassNode {
        return element instanceof GPackageClassNode;
    }

    protected override getRules() {
        return [
            this.ruleNameStartsUppercase({
                label: 'Class node label in upper case',
                description: 'Class names should start with upper case letters'
            })
            // More rules can be added here
        ];
    }
}
