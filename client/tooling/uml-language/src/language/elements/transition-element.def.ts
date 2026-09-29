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
import { Edge, Node, Unbounded, type Visibility } from '../core/element.def.js';

// @ts-nocheck

export type TransitionKind = 'INTERNAL' | 'EXTERNAL' | 'LOCAL';

/**
 * One of the connection points of a shape that has named ones - the four tips of a choice diamond.
 *
 * Named by compass direction rather than by index, because the point is a place on the shape and has
 * to survive the shape being resized or stood the other way up. It is stored per end of the transition
 * rather than worked out from the geometry, so that a transition the user has pinned to the top of a
 * choice stays on the top when the state it comes from is dragged below it.
 */
export type ConnectionPoint = 'NORTH' | 'EAST' | 'SOUTH' | 'WEST';

@Glsp.toolPalette({
    section: 'Transition',
    label: 'Transition',
    icon: 'uml-transition-icon'
})
@Glsp.defaults
export class Transition extends Edge {
    // A transition is labelled `trigger [guard] / effect`, so its name is prose rather than an
    // identifier - `cancel` is as legal as `isCancelRequested()`.
    @Language.text name?: string;
    // The three parts of that notation. They are held apart rather than as one string because the
    // brackets and the slash are notation and not data - and because the model grammar spells JSON
    // structure out in keywords, so a stored `[` has no terminal that could lex it.
    /** The event that fires the transition, e.g. `cancel`. */
    @Language.text trigger?: string;
    /** The condition that has to hold for it to fire, e.g. `isCancelRequested()`. */
    @Language.text guard?: string;
    /** The behaviour run while it fires, e.g. `logOff`. */
    @Language.text effect?: string;
    visibility?: Visibility;
    kind?: TransitionKind = 'EXTERNAL';
    @Language.reference source: Node | Unbounded;
    @Language.reference target: Node | Unbounded;
    // Which connection point of either end the transition is pinned to, where that end is a shape that
    // has named ones. Left unset for every other shape, and for a choice the user has not pinned: an
    // unpinned end is still placed on the nearest tip, just recomputed as the shapes move rather than
    // held. Storing it here rather than as a port reference keeps `source` and `target` pointing at the
    // element the transition is semantically between - the choice, not a point on it.
    sourcePoint?: ConnectionPoint;
    targetPoint?: ConnectionPoint;
}
