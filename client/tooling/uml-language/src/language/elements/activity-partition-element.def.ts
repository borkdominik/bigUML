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
export class ActivityPartition extends Node {
    name: string;
    visibility?: Visibility;
    orientation?: Orientation = 'HORIZONTAL';
    // The lanes. A partition is one thing on the canvas - moved, resized and deleted as a whole - and the
    // bands drawn inside it are these, so a swimlane is not a pile of separate shapes that must be kept
    // touching. Lanes are added, named and removed from the property palette, the way a class's
    // properties are.
    subpartitions?: Array<ActivityPartition>;
    nodes?: Array<Node>;
}
