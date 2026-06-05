/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { representationTypeId } from '@borkdominik-biguml/uml-glsp-server';
import { configureModelElement, FeatureModule, GEdge, PolylineEdgeView } from '@eclipse-glsp/client';
import { DefaultTypes } from '@eclipse-glsp/protocol';
import { NamedElement, NamedElementView } from '../../elements/index.js';

const R = 'statemachine';

export const umlStateMachineDiagramModule = new FeatureModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };

    // Nodes
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'FinalState'), NamedElement, NamedElementView);
    // configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'FinalState'), GFinalStateNode, GFinalStateNodeView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'Region'), NamedElement, NamedElementView);
    // configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'Region'), GRegionNode, GRegionNodeView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'State'), NamedElement, NamedElementView);
    // configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'State'), GStateNode, GStateNodeView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'StateMachine'), NamedElement, NamedElementView);
    // configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'StateMachine'), GStateMachineNode, GStateMachineNodeView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'InitialState'), NamedElement, NamedElementView);
    // configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'InitialState'), GInitialStateNode, GInitialStateNodeView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'Choice'), NamedElement, NamedElementView);
    // configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'Choice'), GChoiceNode, GChoiceNodeView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'Join'), NamedElement, NamedElementView);
    // configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'Join'), GStateJoinNode, GStateJoinNodeView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'Fork'), NamedElement, NamedElementView);
    // configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'Fork'), GStateForkNode, GStateForkNodeView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'DeepHistory'), NamedElement, NamedElementView);
    // configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'DeepHistory'), GDeepHistoryNode, GDeepHistoryNodeView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'ShallowHistory'), NamedElement, NamedElementView);
    // configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'ShallowHistory'), GShallowHistoryNode, GShallowHistoryNodeView);

    // Edges
    configureModelElement(context, representationTypeId(R, DefaultTypes.EDGE, 'Transition'), GEdge, PolylineEdgeView);
    // configureModelElement(context, representationTypeId(R, DefaultTypes.EDGE, 'Transition'), GTransitionEdge, GTransitionEdgeView);
});
