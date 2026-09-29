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
import type { ActivityNode, ActivityPartition } from './activity-partition-element.def.js';
import type { ActivityParameterNode } from './activity-parameter-node-element.def.js';
import type { Property } from './property-element.def.js';

// @ts-nocheck

@Glsp.toolPalette({
    section: 'Container',
    label: 'Activity',
    icon: 'uml-activity-icon'
})
@Glsp.defaults
// The frame the flow is drawn inside.
@Glsp.defaultSize({ width: 600, height: 400 })
export class Activity extends Node {
    name: string;
    visibility?: Visibility;
    // What the activity takes in and hands back, listed under its name in the frame as
    // `parameter-name: parameter-type`.
    //
    // Held as the `Property` a class owns rather than as `Parameter`. The palette builds a section from
    // the type of the list, and the one a class shows for its properties is the one wanted here: a row
    // per entry with an editable name, a delete, and a way into the element itself. The list keeps the
    // name `parameters` because that is what an activity declares, and because the palette labels the
    // section after the list rather than after its type.
    parameters?: Array<Property>;
    // No `partitions` and no `edges`. A partition dropped on an activity is one of its `nodes`, drawn
    // inside it with the rest, and a control flow is stored in the diagram's own relation list. Offering
    // them in the property palette only invited putting something where nothing would read it.
    // The flow and the lanes it runs through. The parameter nodes are on the activity's border rather
    // than in any lane, so they are held here too.
    nodes?: Array<ActivityNode | ActivityPartition | ActivityParameterNode>;
}
