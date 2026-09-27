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
import { Node } from '../core/element.def.js';

// @ts-nocheck

/**
 * A note: the piece of writing UML puts on a diagram to say something the notation itself cannot.
 *
 * `Comment` in the metamodel, and drawn as the box with its top right corner turned down - which is why
 * it is called a note here, after what is on the page rather than after what is in the model. Every
 * diagram gets one, because there is nothing about any of them that makes an aside less useful.
 *
 * It carries a body and no name. A note is the text it holds - there is no second thing to call it, and
 * a name would be a second label to keep in step with the one the reader actually sees. Text, because
 * what people write in a note is prose, and stored as written - brackets and braces included.
 */
@Glsp.toolPalette({
    // Grouped with the free label, which is the same thing with the box taken away - see `TextLabel`.
    section: 'Annotation',
    label: 'Note',
    // Papyrus draws the metaclass rather than the notation, so the icon is the comment's - which is the
    // note shape anyway, corner and all.
    icon: 'uml-comment-icon'
})
@Glsp.defaults
// Attached to what it comments on with a line rather than by containment, so it is in nothing.
@Glsp.floating
@Glsp.defaultSize({ width: 180, height: 90 })
export class Note extends Node {
    /**
     * What the note says. Opens holding the word `Note` rather than nothing at all: a note is only its
     * text, so an empty one is an empty box - there would be nothing on the canvas to see it by, and
     * nothing to double-click to start writing in it.
     */
    @Language.text body?: string = 'Note';
}
