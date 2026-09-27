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
import { Relation } from './relation-element.def.js';
import { type ConnectionPoint } from './transition-element.def.js';

// @ts-nocheck

/** What is drawn at one end of a generic edge. A `CROSS` is the mark UML puts on a non-navigable end. */
export type EdgeMarker = 'NONE' | 'OPEN_ARROW' | 'TRIANGLE' | 'FILLED_TRIANGLE' | 'DIAMOND' | 'FILLED_DIAMOND' | 'CROSS';

/** How the body of a generic edge is stroked. */
export type EdgeLineStyle = 'SOLID' | 'DASHED' | 'DOTTED';

/**
 * A line the user draws the way they want it, between any two elements of any diagram - for whatever
 * the diagram's own relations have no notation for.
 *
 * It carries no UML meaning of its own, only how it looks: the head at either end and whether the line
 * is solid, dashed or dotted. Every diagram gets one, as every diagram gets a note.
 */
@Glsp.toolPalette({
    // Grouped with the note and the free label: the other drawing aids that are not UML notation.
    section: 'Annotation',
    label: 'Generic Edge',
    icon: 'uml-connector-icon'
})
@Glsp.defaults
export class GenericEdge extends Relation {
    name?: string;
    sourceMarker?: EdgeMarker = 'NONE';
    targetMarker?: EdgeMarker = 'OPEN_ARROW';
    lineStyle?: EdgeLineStyle = 'SOLID';
    // Written at either end the way an association writes them - `1`, `*`, `0..*`.
    @Language.multiplicity sourceMultiplicity?: string;
    @Language.multiplicity targetMultiplicity?: string;
    // Which connection point of either end the edge is pinned to - see `Transition.sourcePoint`. Without
    // it the tips a diamond or a state offers would take the click and then forget it.
    sourcePoint?: ConnectionPoint;
    targetPoint?: ConnectionPoint;
}
