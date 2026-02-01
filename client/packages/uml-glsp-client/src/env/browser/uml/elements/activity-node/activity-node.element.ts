/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { type UMLDiagramType } from '@borkdominik-biguml/uml-protocol';
import { CircularNode, configureModelElement, DiamondNode } from '@eclipse-glsp/client';
import { type interfaces } from 'inversify';
import { QualifiedUtil } from '../../qualified.utils.js';
import { NamedElement, NamedElementView } from '../index.js';
import { AcceptEventActionView } from './actions/accept_event_action_view.js';
import { SendSignalActionView } from './actions/send_signal_action_view.js';
import { ActivityFinalNodeView } from './control-nodes/activity_final_node_view.js';
import { DecisionMergeNodeView } from './control-nodes/decision-merge-node-view.js';
import { FlowFinalNodeView } from './control-nodes/flow-final-node-view.js';
import { ForkJoinNodeView } from './control-nodes/fork-join-node-view.js';
import { InitialNodeView } from './control-nodes/initial-node-view.js';

export function registerActivityNodeElement(
    context: { bind: interfaces.Bind; isBound: interfaces.IsBound },
    representation: UMLDiagramType
): void {
    // Actions
    configureModelElement(context, QualifiedUtil.typeId(representation, 'OpaqueAction'), NamedElement, NamedElementView);
    configureModelElement(context, QualifiedUtil.typeId(representation, 'AcceptEventAction'), NamedElement, AcceptEventActionView);
    configureModelElement(context, QualifiedUtil.typeId(representation, 'SendSignalAction'), NamedElement, SendSignalActionView);
    // Control Nodes
    configureModelElement(context, QualifiedUtil.typeId(representation, 'ActivityFinalNode'), CircularNode, ActivityFinalNodeView);
    configureModelElement(context, QualifiedUtil.typeId(representation, 'InitialNode'), CircularNode, InitialNodeView);
    configureModelElement(context, QualifiedUtil.typeId(representation, 'DecisionNode'), DiamondNode, DecisionMergeNodeView);
    configureModelElement(context, QualifiedUtil.typeId(representation, 'MergeNode'), DiamondNode, DecisionMergeNodeView);
    configureModelElement(context, QualifiedUtil.typeId(representation, 'ForkNode'), NamedElement, ForkJoinNodeView);
    configureModelElement(context, QualifiedUtil.typeId(representation, 'JoinNode'), NamedElement, ForkJoinNodeView);
    configureModelElement(context, QualifiedUtil.typeId(representation, 'FlowFinalNode'), CircularNode, FlowFinalNodeView);
    // Object nodes
    configureModelElement(context, QualifiedUtil.typeId(representation, 'CentralBufferNode'), NamedElement, NamedElementView);
    configureModelElement(context, QualifiedUtil.typeId(representation, 'ActivityParameterNode'), NamedElement, NamedElementView);
}
