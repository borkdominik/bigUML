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
import { Node, type Visibility } from '../core/element.def.js';
import type { AcceptEventAction } from './accept-event-action-element.def.js';
import type { ActivityFinalNode } from './activity-final-node-element.def.js';
import type { CentralBufferNode } from './central-buffer-node-element.def.js';
import type { DecisionNode } from './decision-node-element.def.js';
import type { FlowFinalNode } from './flow-final-node-element.def.js';
import type { ForkNode } from './fork-node-element.def.js';
import type { InitialNode } from './initial-node-element.def.js';
import type { JoinNode } from './join-node-element.def.js';
import type { MergeNode } from './merge-node-element.def.js';
import type { OpaqueAction } from './opaque-action-element.def.js';
import type { SendSignalAction } from './send-signal-action-element.def.js';

// @ts-nocheck

/**
 * What stands in a lane of an activity: the actions, the control nodes and the object nodes of the
 * flow - and not an activity, which is what the flow is drawn inside, nor a partition, which divides it.
 */
export type ActivityNode =
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
    | CentralBufferNode;

/**
 * Which way the lanes of a partition run. `HORIZONTAL` stacks them, each band across the diagram with its
 * name turned on its side down the left - the notation's usual swimlanes. `VERTICAL` stands them beside
 * one another, each band a column with its name written straight along the top. Flipping between the two
 * is a property of the partition rather than two kinds of element, because it is the same set of lanes
 * either way round.
 */
export type Orientation = 'HORIZONTAL' | 'VERTICAL';

@Glsp.toolPalette({
    section: 'Container',
    label: 'Activity Partition',
    icon: 'uml-activity-partition-icon'
})
@Glsp.defaults
// A swimlane. Opens with two lanes: one band is just a box with its name turned sideways.
@Glsp.defaultSize({ width: 600, height: 300 })
@Glsp.opensWith({ property: 'subpartitions', count: 2 })
export class ActivityPartition extends Node {
    name: string;
    visibility?: Visibility;
    orientation?: Orientation = 'HORIZONTAL';
    // The lanes. A partition is one thing on the canvas - moved, resized and deleted as a whole - and the
    // bands drawn inside it are these, so a swimlane is not a pile of separate shapes that must be kept
    // touching. Lanes are added, named and removed from the property palette, the way a class's
    // properties are.
    subpartitions?: Array<ActivityPartition>;
    nodes?: Array<ActivityNode>;
}
