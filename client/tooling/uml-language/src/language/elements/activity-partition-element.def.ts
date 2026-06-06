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

// @ts-nocheck

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
    nodes?: Array<Node>;
}
