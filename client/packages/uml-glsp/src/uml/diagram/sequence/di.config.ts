/********************************************************************************
 * Copyright (c) 2021-2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
import '@eclipse-glsp/client/css/glsp-sprotty.css';
import 'sprotty/css/edit-label.css';

import { CircularNodeView, configureModelElement, PolylineEdgeView, SEdge, SPort } from '@eclipse-glsp/client/lib';
import { ContainerModule } from 'inversify';

import { NamedElement } from '../../elements';
import { LifelineElement } from './elements';
import { InteractionElement } from './elements/interacton.model';
import { UmlSequenceTypes } from './sequence.types';
import {
    BehaviorExecutionNodeView,
    DestructionOccurrenceNodeView,
    InteractionNodeView,
    InteractionOperandNodeView,
    LifelineNodeView
} from './views';

export const umlSequenceDiagramModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };

    // DISABLE GRID SNAPPING
    // unbind(TYPES.ISnapper);

    // INTERACTIONS
    configureModelElement(context, UmlSequenceTypes.INTERACTION, InteractionElement, InteractionNodeView);

    // LIFELINE
    configureModelElement(context, UmlSequenceTypes.LIFELINE, LifelineElement, LifelineNodeView);

    // BEHAVIOR_EXECUTION
    configureModelElement(context, UmlSequenceTypes.BEHAVIOR_EXECUTION, NamedElement, BehaviorExecutionNodeView);

    // COMBINED_FRAGMENT
    configureModelElement(context, UmlSequenceTypes.COMBINED_FRAGMENT, NamedElement, InteractionNodeView);

    // INTERACTIO_OPERAND
    configureModelElement(context, UmlSequenceTypes.INTERACTIO_OPERAND, NamedElement, InteractionOperandNodeView);

    // INTERACTION_USE
    configureModelElement(context, UmlSequenceTypes.INTERACTION_USE, NamedElement, InteractionNodeView);

    // MESSAGE_OCCURRENCE
    configureModelElement(context, UmlSequenceTypes.MESSAGE_OCCURRENCE, SPort, CircularNodeView);

    // EXECUTION_OCCURRENCE
    configureModelElement(context, UmlSequenceTypes.EXECUTION_OCCURRENCE, SPort, CircularNodeView);

    // DESTRUCTION_OCCURRENCE
    configureModelElement(context, UmlSequenceTypes.DESTRUCTION_OCCURRENCE, SPort, DestructionOccurrenceNodeView);

    // MESSAGES
    configureModelElement(context, UmlSequenceTypes.MESSAGE, SEdge, PolylineEdgeView);

    // MESSAGE_ANCHOR
    configureModelElement(context, UmlSequenceTypes.MESSAGE_ANCHOR, SPort, CircularNodeView);
});
