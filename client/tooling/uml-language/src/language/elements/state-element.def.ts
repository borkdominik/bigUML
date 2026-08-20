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
     * element - it is part of how a state is drawn. A region *is* one, so a region's band keeps its
     * height in the ordinary place (see `GStateRegionCompartment`).
     */
    partsHeight?: number;
    visibility?: Visibility;
    regions?: Array<Region>;
}
