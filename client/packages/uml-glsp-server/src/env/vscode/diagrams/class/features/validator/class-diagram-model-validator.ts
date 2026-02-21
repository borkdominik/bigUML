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
import { AbstractDiagramModelValidator } from '../../../../features/index.js';
import { GClassNode } from '../../model/elements/class.element.js';

// TODO: Haydar remove
@injectable()
export class ClassDiagramModelValidator extends AbstractDiagramModelValidator<GClassNode> {
    protected isTargetNode(element: GModelElement): element is GClassNode {
        return element instanceof GClassNode;
    }
}
