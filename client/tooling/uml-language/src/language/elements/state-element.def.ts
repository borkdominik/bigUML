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
import type { Region } from './region-element.def.js';
import type { StatePart } from './state-part-element.def.js';

// @ts-nocheck

@Glsp.toolPalette({
    section: 'Container',
    label: 'State',
    icon: 'uml-state-icon'
})
@Glsp.defaults
export class State extends Node {
    name: string;
    /** The lines of the state's second compartment - its internal activities and transitions. */
    parts?: Array<StatePart>;
    /**
     * How tall that compartment is drawn, where the user has given it a height of its own rather than
     * letting it sit at the height of the lines in it.
     *
     * Held on the state rather than as a `Size` metaInfo, which is where every other dimension in a
     * diagram lives: a metaInfo is keyed by the element it belongs to, and the compartment is not an
     * element - it is part of how a state is drawn. `regionHeight` below is held here for the same
     * reason, even though a region *is* an element (see `GStateRegionCompartment`).
     */
    partsHeight?: number;
    visibility?: Visibility;
    regions?: Array<Region>;
    /**
     * How deep each of the state's region bands is drawn.
     *
     * One number for all of them rather than one apiece, because the regions of a state are equals -
     * they divide the same box and run side by side down it, and UML gives none of them a size of its
     * own. Held on the state for the same reason `partsHeight` is: the depth belongs to the way the
     * state is drawn, not to any one region, and a region put on a state is a band of it rather than a
     * shape placed on the canvas with bounds of its own.
     */
    regionHeight?: number;
}
