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
import { Unbounded } from '../core/element.def.js';

// @ts-nocheck

/**
 * One line of the second compartment of a state, written the way UML draws it: `do / print`, or an
 * internal transition such as `cancel [retry] / abort`.
 *
 * The line is typed as one piece and stored as three, for the same two reasons a `Transition` splits
 * its label: the slash and the brackets are notation rather than data, and the model grammar could not
 * hold them anyway - it spells JSON structure out in keywords, leaving no terminal that a `[` could
 * match, and it drops the blanks between tokens, so a stored `do / print` would read back as
 * `do/print`. Put together and taken apart by `composeBehaviorLabel` and `parseBehaviorLabel`, which
 * are the same pair the transition's label goes through.
 *
 * A part is placed by the state that owns it and stores no bounds of its own, hence `Unbounded` and
 * `@Glsp.noBounds` - the pair that keeps it out of the positioned-element branch of the grammar and of
 * the delete handler.
 */
@Glsp.noBounds
export class StatePart extends Unbounded {
    // What a part is called before anything has been typed into it - `NewStatePart1`, written by the
    // create handler, which names every element it makes. It is the line's fallback text and not a
    // part of the notation: the first edit writes the three properties below and clears it, the way a
    // transition's name gives way to its `trigger [guard] / effect`.
    @Language.text name?: string;
    /** What the line is written under: `entry`, `do`, `exit`, or the event of an internal transition. */
    @Language.text trigger?: string;
    /** The condition in brackets, e.g. the `retry` of `cancel [retry] / abort`. */
    @Language.text guard?: string;
    /** The behaviour after the slash, e.g. the `print` of `do / print`. */
    @Language.text effect?: string;
}
