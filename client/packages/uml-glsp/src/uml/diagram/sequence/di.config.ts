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

import {
    bindOrRebind,
    CircularNodeView,
    configureCommand,
    configureModelElement,
    EdgeCreationTool,
    GLSPScrollMouseListener,
    PolylineEdgeView,
    SEdge,
    SPort
} from '@eclipse-glsp/client/lib';
import { ContainerModule, interfaces } from 'inversify';

import { UML_TYPES } from '../../../di.types';
import { NamedElement } from '../../elements';
import { LifelineElement } from './elements';
import { InteractionElement } from './elements/interacton.model';
import { SDLifelineAnchor } from './features/change-bounds/uml-custom-lifeline-anchor';
import { SDMovementRestrictor } from './features/change-bounds/uml-movement-restrictor';
import { SDSelectionService } from './features/change-bounds/uml-selection-service';
import { SDPolylineEdgeRouter } from './features/routing/uml-polyline-routing';
import {
    SDDrawFeedbackPositionedEdgeCommand,
    SDRemoveFeedbackPositionedEdgeCommand
} from './features/tool-feedback/creation-tool-feedback.extension';
import {
    SDDrawHorizontalShiftCommand,
    SDRemoveHorizontalShiftCommand,
    SD_HORIZONTAL_SHIFT
} from './features/tool-feedback/horizontal-shift-tool-feedback';
import {
    SDDrawVerticalShiftCommand,
    SDRemoveVerticalShiftCommand,
    SD_VERTICAL_SHIFT
} from './features/tool-feedback/vertical-shift-tool-feedback';
import { SDEdgeCreationTool } from './features/tools/edge-creation-tool.extension';
import { SDHorizontalShiftNode, SDVerticalShiftNode } from './features/tools/model';
import { SDShiftMouseTool } from './features/tools/shift-mouse-tool';
import { SDShiftTool } from './features/tools/shift-tool';
import { SDHorizontalShiftView, SDVerticalShiftView } from './features/tools/shift-tool-view';
import { SDScrollMouseListener } from './features/viewport/uml-scroll-mouse-listener';
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

    // TODO: Sequence Diagram specific
    unbind(UML_TYPES.ISnapper);
    bind(SDSelectionService).toSelf().inSingletonScope();
    rebind(UML_TYPES.SelectionService).toService(SDSelectionService);

    bind(UML_TYPES.IMovementRestrictor).to(SDMovementRestrictor).inSingletonScope();
    rebind(UML_TYPES.IEdgeRouter).to(SDPolylineEdgeRouter);
    bind(UML_TYPES.IAnchorComputer).to(SDLifelineAnchor);
    bind(SDScrollMouseListener).toSelf().inSingletonScope();
    rebind(GLSPScrollMouseListener).toService(SDScrollMouseListener);
    configureShiftTool(context);

    bindOrRebind(context, EdgeCreationTool).to(SDEdgeCreationTool).inSingletonScope();

    configureCommand({ bind, isBound }, SDDrawFeedbackPositionedEdgeCommand);
    configureCommand({ bind, isBound }, SDRemoveFeedbackPositionedEdgeCommand);

    configureCommand({ bind, isBound }, SDDrawVerticalShiftCommand);
    configureCommand({ bind, isBound }, SDRemoveVerticalShiftCommand);
    configureCommand({ bind, isBound }, SDDrawHorizontalShiftCommand);
    configureCommand({ bind, isBound }, SDRemoveHorizontalShiftCommand);

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

export function configureShiftTool(context: { bind: interfaces.Bind; isBound: interfaces.IsBound }): void {
    configureModelElement(context, SD_VERTICAL_SHIFT, SDVerticalShiftNode, SDVerticalShiftView);
    configureModelElement(context, SD_HORIZONTAL_SHIFT, SDHorizontalShiftNode, SDHorizontalShiftView);
    context.bind(UML_TYPES.IDefaultTool).to(SDShiftTool);
    context.bind(UML_TYPES.ITool).to(SDShiftMouseTool);
}
