/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { UMLDiagramType } from '@borkdominik-biguml/uml-protocol';
import { CircularNode, configureModelElement, DiamondNode } from '@eclipse-glsp/client';
import { DefaultTypes } from '@eclipse-glsp/protocol';
import { interfaces } from 'inversify';
import { QualifiedUtil } from '../../qualified.utils';
import { NamedElement, NamedElementView } from '../index';
import { AcceptEventActionView } from './actions/accept_event_action_view';
import { SendSignalActionView } from './actions/send_signal_action_view';
import { ActivityFinalNodeView } from './control-nodes/activity_final_node_view';
import { DecisionMergeNodeView } from './control-nodes/decision-merge-node-view';
import { FlowFinalNodeView } from './control-nodes/flow-final-node-view';
import { ForkJoinNodeView } from './control-nodes/fork-join-node-view';
import { InitialNodeView } from './control-nodes/initial-node-view';

export function registerActivityNodeElement(
    context: { bind: interfaces.Bind; isBound: interfaces.IsBound },
    representation: UMLDiagramType
): void {
    // Actions
    configureModelElement(context, QualifiedUtil.typeId(representation, 'OpaqueAction'), NamedElement, NamedElementView);
    configureModelElement(context, QualifiedUtil.typeId(representation, 'AcceptEventAction'), NamedElement, AcceptEventActionView);
    configureModelElement(context, QualifiedUtil.typeId(representation, 'SendSignalAction'), NamedElement, SendSignalActionView);
    // Control Nodes
    configureModelElement(
        context,
        QualifiedUtil.representationTypeId(representation, DefaultTypes.NODE_CIRCLE, 'ActivityFinalNode'),
        CircularNode,
        ActivityFinalNodeView
    );
    configureModelElement(
        context,
        QualifiedUtil.representationTypeId(representation, DefaultTypes.NODE_CIRCLE, 'InitialNode'),
        CircularNode,
        InitialNodeView
    );
    configureModelElement(
        context,
        QualifiedUtil.representationTypeId(representation, DefaultTypes.NODE_DIAMOND, 'DecisionNode'),
        DiamondNode,
        DecisionMergeNodeView
    );
    configureModelElement(
        context,
        QualifiedUtil.representationTypeId(representation, DefaultTypes.NODE_DIAMOND, 'MergeNode'),
        DiamondNode,
        DecisionMergeNodeView
    );
    configureModelElement(
        context,
        QualifiedUtil.representationTypeId(representation, DefaultTypes.NODE_RECTANGLE, 'ForkNode'),
        NamedElement,
        ForkJoinNodeView
    );
    configureModelElement(
        context,
        QualifiedUtil.representationTypeId(representation, DefaultTypes.NODE_RECTANGLE, 'JoinNode'),
        NamedElement,
        ForkJoinNodeView
    );
    configureModelElement(
        context,
        QualifiedUtil.representationTypeId(UMLDiagramType.ACTIVITY, DefaultTypes.NODE_CIRCLE, 'FlowFinalNode'),
        CircularNode,
        FlowFinalNodeView
    );
    // Object nodes
    configureModelElement(context, QualifiedUtil.typeId(representation, 'CentralBufferNode'), NamedElement, NamedElementView);
    configureModelElement(
        context,
        QualifiedUtil.representationTypeId(representation, DefaultTypes.PORT, 'ActivityParameterNode'),
        NamedElement,
        NamedElementView
    );
}
