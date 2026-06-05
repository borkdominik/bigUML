/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { Glsp } from '@borkdominik-biguml/uml-glsp-server/generator';
import 'reflect-metadata';
import type { AcceptEventAction } from '../elements/accept-event-action-element.def.js';
import type { Activity } from '../elements/activity-element.def.js';
import type { ActivityFinalNode } from '../elements/activity-final-node-element.def.js';
import type { ActivityParameterNode } from '../elements/activity-parameter-node-element.def.js';
import type { ActivityPartition } from '../elements/activity-partition-element.def.js';
import type { CentralBufferNode } from '../elements/central-buffer-node-element.def.js';
import type { ControlFlow } from '../elements/control-flow-element.def.js';
import type { DecisionNode } from '../elements/decision-node-element.def.js';
import type { FlowFinalNode } from '../elements/flow-final-node-element.def.js';
import type { ForkNode } from '../elements/fork-node-element.def.js';
import type { InitialNode } from '../elements/initial-node-element.def.js';
import type { InputPin } from '../elements/input-pin-element.def.js';
import type { JoinNode } from '../elements/join-node-element.def.js';
import type { MergeNode } from '../elements/merge-node-element.def.js';
import type { OpaqueAction } from '../elements/opaque-action-element.def.js';
import type { OutputPin } from '../elements/output-pin-element.def.js';
import type { SendSignalAction } from '../elements/send-signal-action-element.def.js';

// @ts-nocheck

@Glsp.defaults
export class ActivityDiagram {
    diagramType: 'ACTIVITY';
    entities?: Array<ActivityDiagramNodes>;
    relations?: Array<ActivityDiagramEdges>;
}

type ActivityDiagramElements = ActivityDiagramNodes | ActivityDiagramEdges;

type ActivityDiagramNodes =
    | Activity
    | ActivityPartition
    | OpaqueAction
    | AcceptEventAction
    | SendSignalAction
    | InitialNode
    | DecisionNode
    | MergeNode
    | JoinNode
    | ForkNode
    | ActivityFinalNode
    | FlowFinalNode
    | CentralBufferNode
    | ActivityParameterNode
    | InputPin
    | OutputPin;

type ActivityDiagramEdges = ControlFlow;
