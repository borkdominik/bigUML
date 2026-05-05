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
    FeatureModule,
    GEdge,
    GLSPScrollMouseListener,
    GPort,
    PolylineEdgeView,
    SelectionService
} from '@eclipse-glsp/client';
import { type interfaces } from 'inversify';
import { UML_TYPES } from '../../../uml-glsp.types.js';
import { NamedElement } from '../../elements/index.js';
import { LifelineElement } from './elements/index.js';
import { InteractionElement } from './elements/interacton.model.js';
import { SDLifelineAnchor } from './features/change-bounds/uml-custom-lifeline-anchor.js';
import { SDMovementRestrictor } from './features/change-bounds/uml-movement-restrictor.js';
import { SDSelectionService } from './features/change-bounds/uml-selection-service.js';
import { SDPolylineEdgeRouter } from './features/routing/uml-polyline-routing.js';
import {
    SDDrawFeedbackPositionedEdgeCommand,
    SDRemoveFeedbackPositionedEdgeCommand
} from './features/tool-feedback/creation-tool-feedback.extension.js';
import {
    SD_HORIZONTAL_SHIFT,
    SDDrawHorizontalShiftCommand,
    SDRemoveHorizontalShiftCommand
} from './features/tool-feedback/horizontal-shift-tool-feedback.js';
import {
    SD_VERTICAL_SHIFT,
    SDDrawVerticalShiftCommand,
    SDRemoveVerticalShiftCommand
} from './features/tool-feedback/vertical-shift-tool-feedback.js';
import { SDEdgeCreationTool } from './features/tools/edge-creation-tool.extension.js';
import { SDHorizontalShiftNode, SDVerticalShiftNode } from './features/tools/model.js';
import { SDShiftMouseTool } from './features/tools/shift-mouse-tool.js';
import { SDHorizontalShiftView, SDVerticalShiftView } from './features/tools/shift-tool-view.js';
import { SDShiftTool } from './features/tools/shift-tool.js';
import { SDScrollMouseListener } from './features/viewport/uml-scroll-mouse-listener.js';
import { UMLSequenceTypes } from './sequence.types.js';
import {
    BehaviorExecutionNodeView,
    DestructionOccurrenceNodeView,
    InteractionNodeView,
    InteractionOperandNodeView,
    LifelineNodeView
} from './views/index.js';

export const umlSequenceDiagramModule = new FeatureModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };

    // TODO: Sequence Diagram specific
    unbind(UML_TYPES.ISnapper);
    bindOrRebind(context, SelectionService).to(SDSelectionService).inSingletonScope();

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
    configureModelElement(context, UMLSequenceTypes.INTERACTION, InteractionElement, InteractionNodeView);

    // LIFELINE
    configureModelElement(context, UMLSequenceTypes.LIFELINE, LifelineElement, LifelineNodeView);

    // BEHAVIOR_EXECUTION
    configureModelElement(context, UMLSequenceTypes.BEHAVIOR_EXECUTION, NamedElement, BehaviorExecutionNodeView);

    // COMBINED_FRAGMENT
    configureModelElement(context, UMLSequenceTypes.COMBINED_FRAGMENT, NamedElement, InteractionNodeView);

    // INTERACTIO_OPERAND
    configureModelElement(context, UMLSequenceTypes.INTERACTIO_OPERAND, NamedElement, InteractionOperandNodeView);

    // INTERACTION_USE
    configureModelElement(context, UMLSequenceTypes.INTERACTION_USE, NamedElement, InteractionNodeView);

    // MESSAGE_OCCURRENCE
    configureModelElement(context, UMLSequenceTypes.MESSAGE_OCCURRENCE, GPort, CircularNodeView);

    // EXECUTION_OCCURRENCE
    configureModelElement(context, UMLSequenceTypes.EXECUTION_OCCURRENCE, GPort, CircularNodeView);

    // DESTRUCTION_OCCURRENCE
    configureModelElement(context, UMLSequenceTypes.DESTRUCTION_OCCURRENCE, GPort, DestructionOccurrenceNodeView);

    // MESSAGES
    configureModelElement(context, UMLSequenceTypes.MESSAGE, GEdge, PolylineEdgeView);

    // MESSAGE_ANCHOR
    configureModelElement(context, UMLSequenceTypes.MESSAGE_ANCHOR, GPort, CircularNodeView);
});

export function configureShiftTool(context: { bind: interfaces.Bind; isBound: interfaces.IsBound }): void {
    configureModelElement(context, SD_VERTICAL_SHIFT, SDVerticalShiftNode, SDVerticalShiftView);
    configureModelElement(context, SD_HORIZONTAL_SHIFT, SDHorizontalShiftNode, SDHorizontalShiftView);
    context.bind(UML_TYPES.IDefaultTool).to(SDShiftTool);
    context.bind(UML_TYPES.ITool).to(SDShiftMouseTool);
}
