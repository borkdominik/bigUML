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
import type { Property } from './property-element.def.js';

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
    // What the activity takes in and hands back, listed under its name in the frame as
    // `parameter-name: parameter-type`.
    //
    // Held as the `Property` a class owns rather than as `Parameter`. The palette builds a section from
    // the type of the list, and the one a class shows for its properties is the one wanted here: a row
    // per entry with an editable name, a delete, and a way into the element itself. The list keeps the
    // name `parameters` because that is what an activity declares, and because the palette labels the
    // section after the list rather than after its type.
    parameters?: Array<Property>;
    // No `partitions` and no `edges`. Both were containment lists nothing ever filled: an activity holds
    // the nodes drawn on it as flat siblings of the diagram (see `FLAT_CONTAINER_TYPES`), and a control
    // flow is stored in the diagram's own relation list, which is the only place the gmodel factory reads
    // flows from. Offering them in the property palette only invited putting something where it would be
    // stored and never drawn.
    nodes?: Array<Node>;
}
