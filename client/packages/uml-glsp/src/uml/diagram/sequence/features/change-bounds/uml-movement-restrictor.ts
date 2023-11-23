/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { IMovementRestrictor, isNotUndefined, Point, SCompartment, SModelElement, SNode, SPort } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { NamedElement } from '../../../../elements';
import { UmlSequenceTypes } from '../../sequence.types';

// TODO: Sequence Diagram specific
@injectable()
export class SDMovementRestrictor implements IMovementRestrictor {
    validate(element: SModelElement, newLocation?: Point | undefined): boolean {
        // limit OCCURRENCE & EXECUTION SPEC movement
        const distanceLimit = 40;

        if (
            (element instanceof SPort || element instanceof NamedElement) &&
            ((element.type === UmlSequenceTypes.MESSAGE_OCCURRENCE &&
                (element.parent as SCompartment).parent.type === UmlSequenceTypes.LIFELINE) ||
                element.type === UmlSequenceTypes.DESTRUCTION_OCCURRENCE ||
                element.type === UmlSequenceTypes.EXECUTION_OCCURRENCE ||
                element.type === UmlSequenceTypes.BEHAVIOR_EXECUTION)
        ) {
            if (isNotUndefined(newLocation) && (Math.abs(newLocation.x) > distanceLimit || element.position.y + newLocation.y < 0)) {
                return false;
            }
        }
        // limit LIFELINE movement
        const normalPositionY = 30;
        if (
            element instanceof SNode &&
            element.type === UmlSequenceTypes.LIFELINE &&
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
