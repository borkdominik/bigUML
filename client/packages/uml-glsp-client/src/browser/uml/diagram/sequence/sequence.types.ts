/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { UMLDiagramType } from '@borkdominik-biguml/uml-protocol';
import { DefaultTypes } from '@eclipse-glsp/client';
import { QualifiedUtil } from '../../qualified.utils.js';
export namespace UMLSequenceTypes {
    export const INTERACTION = QualifiedUtil.representationTypeId(UMLDiagramType.SEQUENCE, DefaultTypes.NODE, 'Interaction');
    export const LIFELINE = QualifiedUtil.representationTypeId(UMLDiagramType.SEQUENCE, DefaultTypes.NODE, 'Lifeline');
    export const MESSAGE_OCCURRENCE = QualifiedUtil.representationTypeId(
        UMLDiagramType.SEQUENCE,
        DefaultTypes.NODE,
        'MessageOccurrenceSpecification'
    );

    export const MESSAGE_ANCHOR = QualifiedUtil.representationTypeId(UMLDiagramType.SEQUENCE, DefaultTypes.NODE, 'MessageAnchor');

    export const EXECUTION_OCCURRENCE = QualifiedUtil.representationTypeId(
        UMLDiagramType.SEQUENCE,
        DefaultTypes.NODE,
        'ExecutionOccurrenceSpecification'
    );

    export const DESTRUCTION_OCCURRENCE = QualifiedUtil.representationTypeId(
        UMLDiagramType.SEQUENCE,
        DefaultTypes.NODE,
        'DestructionOccurrenceSpecification'
    );

    export const BEHAVIOR_EXECUTION = QualifiedUtil.representationTypeId(
        UMLDiagramType.SEQUENCE,
        DefaultTypes.NODE,
        'BehaviorExecutionSpecification'
    );
    export const MESSAGE = QualifiedUtil.representationTypeId(UMLDiagramType.SEQUENCE, DefaultTypes.EDGE, 'Message');

    export const COMBINED_FRAGMENT = QualifiedUtil.representationTypeId(UMLDiagramType.SEQUENCE, DefaultTypes.NODE, 'CombinedFragment');

    export const INTERACTION_USE = QualifiedUtil.representationTypeId(UMLDiagramType.SEQUENCE, DefaultTypes.NODE, 'InteractionUse');

    export const INTERACTIO_OPERAND = QualifiedUtil.representationTypeId(
        UMLDiagramType.SEQUENCE,
        DefaultTypes.COMPARTMENT,
        'InteractionOperand'
    );
    // export const MESSAGE_LABEL_ARROW_EDGE_NAME = `${DefaultTypes.LABEL}:message-arrow-edge-name`;
}
