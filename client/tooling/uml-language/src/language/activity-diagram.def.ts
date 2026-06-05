/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { Glsp } from '@borkdominik-biguml/uml-glsp-server/generator';
import { Language } from '@borkdominik-biguml/uml-language-tooling';
import 'reflect-metadata';
import { Edge, Node, Unbounded, type Visibility } from './element.def.js';

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

/**
 * CONTAINERS
 */

@Glsp.toolPalette({
    section: 'Container',
    label: 'Activity',
    icon: 'uml-activity-icon'
})
@Glsp.defaults
export class Activity extends Node {
    name: string;
    visibility?: Visibility;
    partitions?: Array<ActivityPartition>;
    nodes?: Array<ActivityDiagramNodes>;
    edges?: Array<ControlFlow>;
}

@Glsp.toolPalette({
    section: 'Container',
    label: 'Activity Partition',
    icon: 'uml-activity-partition-icon'
})
@Glsp.defaults
export class ActivityPartition extends Node {
    name: string;
    visibility?: Visibility;
    subpartitions?: Array<ActivityPartition>;
    nodes?: Array<ActivityDiagramNodes>;
}

/**
 * ACTIONS
 */

@Glsp.toolPalette({
    section: 'Actions',
    label: 'Opaque Action',
    icon: 'uml-opaque-action-icon'
})
@Glsp.defaults
export class OpaqueAction extends Node {
    name: string;
    visibility?: Visibility;
    inputPins?: Array<InputPin>;
    outputPins?: Array<OutputPin>;
}

@Glsp.toolPalette({
    section: 'Actions',
    label: 'Accept Event Action',
    icon: 'uml-accept-event-action-icon'
})
@Glsp.defaults
export class AcceptEventAction extends Node {
    name: string;
    visibility?: Visibility;
}

@Glsp.toolPalette({
    section: 'Actions',
    label: 'Send Signal Action',
    icon: 'uml-send-signal-action-icon'
})
@Glsp.defaults
export class SendSignalAction extends Node {
    name: string;
    visibility?: Visibility;
}

/**
 * CONTROL NODES
 */

@Glsp.toolPalette({
    section: 'Control Nodes',
    label: 'Initial Node',
    icon: 'uml-initial-node-icon'
})
@Glsp.noBounds
@Glsp.defaults
export class InitialNode extends Unbounded {
    name?: string;
    visibility?: Visibility;
}

@Glsp.toolPalette({
    section: 'Control Nodes',
    label: 'Decision Node',
    icon: 'uml-decision-node-icon'
})
@Glsp.noBounds
@Glsp.defaults
export class DecisionNode extends Unbounded {
    name?: string;
    visibility?: Visibility;
}

@Glsp.toolPalette({
    section: 'Control Nodes',
    label: 'Merge Node',
    icon: 'uml-merge-node-icon'
})
@Glsp.noBounds
@Glsp.defaults
export class MergeNode extends Unbounded {
    name?: string;
    visibility?: Visibility;
}

@Glsp.toolPalette({
    section: 'Control Nodes',
    label: 'Join Node',
    icon: 'uml-join-node-icon'
})
@Glsp.noBounds
@Glsp.defaults
export class JoinNode extends Unbounded {
    name?: string;
    visibility?: Visibility;
}

@Glsp.toolPalette({
    section: 'Control Nodes',
    label: 'Fork Node',
    icon: 'uml-fork-node-icon'
})
@Glsp.noBounds
@Glsp.defaults
export class ForkNode extends Unbounded {
    name?: string;
    visibility?: Visibility;
}

@Glsp.toolPalette({
    section: 'Control Nodes',
    label: 'Activity Final Node',
    icon: 'uml-activity-final-node-icon'
})
@Glsp.noBounds
@Glsp.defaults
export class ActivityFinalNode extends Unbounded {
    name?: string;
    visibility?: Visibility;
}

@Glsp.toolPalette({
    section: 'Control Nodes',
    label: 'Flow Final Node',
    icon: 'uml-flow-final-node-icon'
})
@Glsp.noBounds
@Glsp.defaults
export class FlowFinalNode extends Unbounded {
    name?: string;
    visibility?: Visibility;
}

/**
 * OBJECT NODES
 */

@Glsp.toolPalette({
    section: 'Object Nodes',
    label: 'Central Buffer Node',
    icon: 'uml-central-buffer-node-icon'
})
@Glsp.defaults
export class CentralBufferNode extends Node {
    name: string;
    visibility?: Visibility;
}

@Glsp.toolPalette({
    section: 'Object Nodes',
    label: 'Activity Parameter Node',
    icon: 'uml-activity-parameter-node-icon'
})
@Glsp.defaults
export class ActivityParameterNode extends Node {
    name: string;
    visibility?: Visibility;
}

/**
 * PINS
 */

@Glsp.toolPalette({
    section: 'Object Nodes',
    label: 'Input Pin',
    icon: 'uml-input-pin-icon'
})
@Glsp.noBounds
@Glsp.defaults
export class InputPin extends Unbounded {
    name: string;
    visibility?: Visibility;
}

@Glsp.toolPalette({
    section: 'Object Nodes',
    label: 'Output Pin',
    icon: 'uml-output-pin-icon'
})
@Glsp.noBounds
@Glsp.defaults
export class OutputPin extends Unbounded {
    name: string;
    visibility?: Visibility;
}

/**
 * EDGES
 */

@Glsp.toolPalette({
    section: 'Edges',
    label: 'Control Flow',
    icon: 'uml-control-flow-icon'
})
@Glsp.defaults
export class ControlFlow extends Edge {
    name?: string;
    visibility?: Visibility;
    guard?: string;
    weight?: number;
    @Language.reference source: Node | Unbounded;
    @Language.reference target: Node | Unbounded;
}
