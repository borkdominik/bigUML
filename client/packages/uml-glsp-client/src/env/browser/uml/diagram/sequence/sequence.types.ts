/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { representationTypeId, UmlDiagramType } from '@borkdominik-biguml/uml-glsp-server';
import { DefaultTypes } from '@eclipse-glsp/client';

export namespace UMLSequenceTypes {
    export const INTERACTION = representationTypeId(UmlDiagramType.SEQUENCE, DefaultTypes.NODE, 'Interaction');
    export const LIFELINE = representationTypeId(UmlDiagramType.SEQUENCE, DefaultTypes.NODE, 'Lifeline');
    export const MESSAGE_OCCURRENCE = representationTypeId(UmlDiagramType.SEQUENCE, DefaultTypes.NODE, 'MessageOccurrenceSpecification');

    export const MESSAGE_ANCHOR = representationTypeId(UmlDiagramType.SEQUENCE, DefaultTypes.NODE, 'MessageAnchor');

    export const EXECUTION_OCCURRENCE = representationTypeId(
        UmlDiagramType.SEQUENCE,
        DefaultTypes.NODE,
        'ExecutionOccurrenceSpecification'
    );

    export const DESTRUCTION_OCCURRENCE = representationTypeId(
        UmlDiagramType.SEQUENCE,
        DefaultTypes.NODE,
        'DestructionOccurrenceSpecification'
    );

    export const BEHAVIOR_EXECUTION = representationTypeId(UmlDiagramType.SEQUENCE, DefaultTypes.NODE, 'BehaviorExecutionSpecification');
    export const MESSAGE = representationTypeId(UmlDiagramType.SEQUENCE, DefaultTypes.EDGE, 'Message');

    export const COMBINED_FRAGMENT = representationTypeId(UmlDiagramType.SEQUENCE, DefaultTypes.NODE, 'CombinedFragment');

    export const INTERACTION_USE = representationTypeId(UmlDiagramType.SEQUENCE, DefaultTypes.NODE, 'InteractionUse');

    export const INTERACTIO_OPERAND = representationTypeId(UmlDiagramType.SEQUENCE, DefaultTypes.COMPARTMENT, 'InteractionOperand');
    // export const MESSAGE_LABEL_ARROW_EDGE_NAME = `${DefaultTypes.LABEL}:message-arrow-edge-name`;
}
