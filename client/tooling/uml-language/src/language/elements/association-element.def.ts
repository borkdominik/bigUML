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
import { type Visibility } from '../core/element.def.js';
import type { AggregationType } from './property-element.def.js';
import { Relation } from './relation-element.def.js';
import { type ConnectionPoint } from './transition-element.def.js';

// @ts-nocheck

@Glsp.toolPalette({
    section: 'Relations',
    label: 'Association',
    icon: 'uml-association-icon'
})
@Glsp.defaults
export class Association extends Relation {
    name?: string;
    @Language.text sourceMultiplicity?: string = '*';
    @Language.text targetMultiplicity?: string = '*';
    sourceName?: string;
    targetName?: string;
    /**
     * The property string of either end - what UML writes in braces beside it, `{ordered}`, `{unique}`,
     * `{subsets owner}`.
     *
     * The braces are notation and not data, so they are put on to be drawn and taken off again to be
     * stored - which is also the only way this can be stored at all: the model grammar spells JSON
     * structure out in keywords, and a `{` inside a value has no terminal that could lex it. Text rather
     * than a plain string for the same reason a guard is: a property string carries blanks and commas.
     */
    @Language.text sourceModifiers?: string;
    @Language.text targetModifiers?: string;
    sourceAggregation?: AggregationType = 'NONE';
    targetAggregation?: AggregationType = 'NONE';
    visibility?: Visibility;
    // Which connection point of either end the association is pinned to, exactly as a transition and a
    // control flow record it - see `Transition.sourcePoint`. The class diagram draws the same branch
    // diamond as those two do, offering the same four tips, and an association is what a class diagram
    // runs to one of them with: without a copy of its own the tips would be dots that take a click and
    // then forget it, the pin being read back from the file and there being nothing there to read.
    sourcePoint?: ConnectionPoint;
    targetPoint?: ConnectionPoint;
}
