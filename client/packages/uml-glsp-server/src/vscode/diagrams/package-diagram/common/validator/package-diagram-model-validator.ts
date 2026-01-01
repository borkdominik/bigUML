/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { type GModelElement } from '@eclipse-glsp/server';
import { injectable } from 'inversify';
import { AbstractDiagramModelValidator } from '../../../../common/validator/abstract-diagram-model-validator.js';
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
