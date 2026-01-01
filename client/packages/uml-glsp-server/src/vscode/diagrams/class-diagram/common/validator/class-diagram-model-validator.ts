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
import { GClassNode } from '../../model/elements/class.graph-extension.js';

@injectable()
export class ClassDiagramModelValidator extends AbstractDiagramModelValidator<GClassNode> {
    protected isTargetNode(element: GModelElement): element is GClassNode {
        return element instanceof GClassNode;
    }

    protected override getRules() {
        return [
            this.ruleNameStartsUppercase({
                label: 'Class node label in upper case',
                description: 'Class names should start with upper case letters'
            })
            // more rules can be added here
        ];
    }
}
