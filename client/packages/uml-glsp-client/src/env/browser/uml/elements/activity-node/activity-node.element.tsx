/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { CircularNode, DiamondNode } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { NamedElement, NamedElementView } from '../index.js';
import { AcceptEventActionView } from './actions/accept_event_action_view.js';
import { SendSignalActionView } from './actions/send_signal_action_view.js';
import { ActivityFinalNodeView } from './control-nodes/activity_final_node_view.js';
import { DecisionMergeNodeView } from './control-nodes/decision-merge-node-view.js';
import { FlowFinalNodeView } from './control-nodes/flow-final-node-view.js';
import { ForkJoinNodeView } from './control-nodes/fork-join-node-view.js';
import { InitialNodeView } from './control-nodes/initial-node-view.js';

export class GOpaqueActionNode extends NamedElement {}

@injectable()
export class GOpaqueActionNodeView extends NamedElementView {}

export class GAcceptEventActionNode extends NamedElement {}

@injectable()
export class GAcceptEventActionNodeView extends AcceptEventActionView {}

export class GSendSignalActionNode extends NamedElement {}

@injectable()
export class GSendSignalActionNodeView extends SendSignalActionView {}

export class GActivityFinalNode extends CircularNode {}

@injectable()
export class GActivityFinalNodeView extends ActivityFinalNodeView {}

export class GInitialActivityNode extends CircularNode {}

@injectable()
export class GInitialActivityNodeView extends InitialNodeView {}

export class GDecisionNode extends DiamondNode {}

@injectable()
export class GDecisionNodeView extends DecisionMergeNodeView {}

export class GMergeNode extends DiamondNode {}

@injectable()
export class GMergeNodeView extends DecisionMergeNodeView {}

export class GForkNode extends NamedElement {}

@injectable()
export class GForkNodeView extends ForkJoinNodeView {}

export class GJoinNode extends NamedElement {}

@injectable()
export class GJoinNodeView extends ForkJoinNodeView {}

export class GFlowFinalNode extends CircularNode {}

@injectable()
export class GFlowFinalNodeView extends FlowFinalNodeView {}

export class GCentralBufferNode extends NamedElement {}

@injectable()
export class GCentralBufferNodeView extends NamedElementView {}

export class GActivityParameterNode extends NamedElement {}

@injectable()
export class GActivityParameterNodeView extends NamedElementView {}
