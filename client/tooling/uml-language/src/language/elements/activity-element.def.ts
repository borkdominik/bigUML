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
import type { ActivityPartition } from './activity-partition-element.def.js';
import type { ControlFlow } from './control-flow-element.def.js';

// @ts-nocheck

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
    nodes?: Array<Node>;
    edges?: Array<ControlFlow>;
}
