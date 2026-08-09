/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { representationTypeId } from '@borkdominik-biguml/uml-glsp-server';
import { configureModelElement, FeatureModule } from '@eclipse-glsp/client';
import { DefaultTypes } from '@eclipse-glsp/protocol';
import {
    GAcceptEventActionNode,
    GAcceptEventActionNodeView,
    GActivityFinalNode,
    GActivityFinalNodeView,
    GActivityNode,
    GActivityNodeView,
    GActivityParameterNode,
    GActivityParameterNodeView,
    GActivityPartitionNode,
    GActivityPartitionNodeView,
    GCentralBufferNode,
    GCentralBufferNodeView,
    GControlFlowEdge,
    GControlFlowEdgeView,
    GDecisionNode,
    GDecisionNodeView,
    GFlowFinalNode,
    GFlowFinalNodeView,
    GForkNode,
    GForkNodeView,
    GInitialActivityNode,
    GInitialActivityNodeView,
    GInputPinNode,
    GInputPinNodeView,
    GJoinNode,
    GJoinNodeView,
    GMergeNode,
    GMergeNodeView,
    GOpaqueActionNode,
    GOpaqueActionNodeView,
    GOutputPinNode,
    GOutputPinNodeView,
    GPropertyNode,
    GPropertyNodeView,
    GSendSignalActionNode,
    GSendSignalActionNodeView
} from '../../elements/index.js';

const R = 'Activity';

export const umlActivityDiagramModule = new FeatureModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };

    // Nodes
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'Activity'), GActivityNode, GActivityNodeView);
    configureModelElement(
        context,
        representationTypeId(R, DefaultTypes.NODE, 'ActivityPartition'),
        GActivityPartitionNode,
        GActivityPartitionNodeView
    );
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'OpaqueAction'), GOpaqueActionNode, GOpaqueActionNodeView);
    configureModelElement(
        context,
        representationTypeId(R, DefaultTypes.NODE, 'AcceptEventAction'),
        GAcceptEventActionNode,
        GAcceptEventActionNodeView
    );
    configureModelElement(
        context,
        representationTypeId(R, DefaultTypes.NODE, 'SendSignalAction'),
        GSendSignalActionNode,
        GSendSignalActionNodeView
    );
    configureModelElement(
        context,
        representationTypeId(R, DefaultTypes.NODE, 'ActivityFinalNode'),
        GActivityFinalNode,
        GActivityFinalNodeView
    );
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'InitialNode'), GInitialActivityNode, GInitialActivityNodeView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'DecisionNode'), GDecisionNode, GDecisionNodeView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'MergeNode'), GMergeNode, GMergeNodeView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'ForkNode'), GForkNode, GForkNodeView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'JoinNode'), GJoinNode, GJoinNodeView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'FlowFinalNode'), GFlowFinalNode, GFlowFinalNodeView);
    configureModelElement(
        context,
        representationTypeId(R, DefaultTypes.NODE, 'CentralBufferNode'),
        GCentralBufferNode,
        GCentralBufferNodeView
    );
    configureModelElement(
        context,
        representationTypeId(R, DefaultTypes.NODE, 'ActivityParameterNode'),
        GActivityParameterNode,
        GActivityParameterNodeView
    );
    // Registered as nodes, which is what the server emits them as: the generated model types build both
    // pin ids with `DefaultTypes.NODE`. Registered against `PORT` these two bindings matched no element
    // the server ever sent, and a pin fell through to the default view.
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'InputPin'), GInputPinNode, GInputPinNodeView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'OutputPin'), GOutputPinNode, GOutputPinNodeView);
    // The parameter rows an activity lists on its frame. Held and drawn as the class diagram's `Property`,
    // so its element and view are the ones registered here - a row is a row wherever it is written -
    // against the activity's own `Property` node type.
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'Property'), GPropertyNode, GPropertyNodeView);

    // Edges
    configureModelElement(context, representationTypeId(R, DefaultTypes.EDGE, 'ControlFlow'), GControlFlowEdge, GControlFlowEdgeView);
});
