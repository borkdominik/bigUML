/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

import { IMovementRestrictor, Point, SCompartment, SModelElement, SNode, SPort, isNotUndefined } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { UmlSequenceTypes } from '../../uml/diagram/sequence/sequence.types';
import { NamedElement } from '../../uml/elements';

@injectable()
export class UmlMovementRestrictor implements IMovementRestrictor {
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
