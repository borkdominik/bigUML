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

import { UmlDiagramType } from '@borkdominik-biguml/uml-common';
import { DefaultTypes } from '@eclipse-glsp/client';
import { QualifiedUtil } from '../../qualified.utils';
export namespace UmlSequenceTypes {
    export const INTERACTION = QualifiedUtil.representationTypeId(UmlDiagramType.SEQUENCE, DefaultTypes.NODE, 'Interaction');
    export const LIFELINE = QualifiedUtil.representationTypeId(UmlDiagramType.SEQUENCE, DefaultTypes.NODE, 'Lifeline');
    export const MESSAGE_OCCURRENCE = QualifiedUtil.representationTypeId(
        UmlDiagramType.SEQUENCE,
        DefaultTypes.NODE,
        'MessageOccurrenceSpecification'
    );

    export const MESSAGE_ANCHOR = QualifiedUtil.representationTypeId(UmlDiagramType.SEQUENCE, DefaultTypes.NODE, 'MessageAnchor');

    export const EXECUTION_OCCURRENCE = QualifiedUtil.representationTypeId(
        UmlDiagramType.SEQUENCE,
        DefaultTypes.NODE,
        'ExecutionOccurrenceSpecification'
    );

    export const DESTRUCTION_OCCURRENCE = QualifiedUtil.representationTypeId(
        UmlDiagramType.SEQUENCE,
        DefaultTypes.NODE,
        'DestructionOccurrenceSpecification'
    );

    export const BEHAVIOR_EXECUTION = QualifiedUtil.representationTypeId(
        UmlDiagramType.SEQUENCE,
        DefaultTypes.NODE,
        'BehaviorExecutionSpecification'
    );
    export const MESSAGE = QualifiedUtil.representationTypeId(UmlDiagramType.SEQUENCE, DefaultTypes.EDGE, 'Message');

    export const COMBINED_FRAGMENT = QualifiedUtil.representationTypeId(UmlDiagramType.SEQUENCE, DefaultTypes.NODE, 'CombinedFragment');

    export const INTERACTION_USE = QualifiedUtil.representationTypeId(UmlDiagramType.SEQUENCE, DefaultTypes.NODE, 'InteractionUse');

    export const INTERACTIO_OPERAND = QualifiedUtil.representationTypeId(
        UmlDiagramType.SEQUENCE,
        DefaultTypes.COMPARTMENT,
        'InteractionOperand'
    );
    // export const MESSAGE_LABEL_ARROW_EDGE_NAME = `${DefaultTypes.LABEL}:message-arrow-edge-name`;
}
