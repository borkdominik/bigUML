/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { type GCompartment, type GModelElement, GNode, GPort, type IMovementRestrictor, isNotUndefined, type Point } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { NamedElement } from '../../../../elements/index.js';
import { UMLSequenceTypes } from '../../sequence.types.js';

// TODO: Sequence Diagram specific
@injectable()
export class SDMovementRestrictor implements IMovementRestrictor {
    validate(element: GModelElement, newLocation?: Point | undefined): boolean {
        // limit OCCURRENCE & EXECUTION SPEC movement
        const distanceLimit = 40;

        if (
            (element instanceof GPort || element instanceof NamedElement) &&
            ((element.type === UMLSequenceTypes.MESSAGE_OCCURRENCE &&
                (element.parent as GCompartment).parent.type === UMLSequenceTypes.LIFELINE) ||
                element.type === UMLSequenceTypes.DESTRUCTION_OCCURRENCE ||
                element.type === UMLSequenceTypes.EXECUTION_OCCURRENCE ||
                element.type === UMLSequenceTypes.BEHAVIOR_EXECUTION)
        ) {
            if (isNotUndefined(newLocation) && (Math.abs(newLocation.x) > distanceLimit || element.position.y + newLocation.y < 0)) {
                return false;
            }
        }
        // limit LIFELINE movement
        const normalPositionY = 30;
        if (
            element instanceof GNode &&
            element.type === UMLSequenceTypes.LIFELINE &&
            !element.cssClasses?.includes('uml-sequence-lifeline-created')
        ) {
            if (isNotUndefined(newLocation) && Math.abs(newLocation.y - normalPositionY) > distanceLimit) {
                return false;
            }
        }
        return true;
    }
    cssClasses = ['overlap-forbidden-mode'];
}
