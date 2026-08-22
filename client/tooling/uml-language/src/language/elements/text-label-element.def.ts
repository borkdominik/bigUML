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
 * A label: writing put on a diagram with nothing drawn around it.
 *
 * A note with the note taken away. The two say the same kind of thing and are stored the same way - a
 * `body` of free text, no name, and no notation of their own - and they differ only in whether the
 * writing is presented as a remark pinned to the diagram or simply as words on it. A caption over a
 * group of shapes, a heading, a scribble in the margin: all of them are worse inside a box.
 *
 * Called `TextLabel` and not `Label` because a label is already several things here - the shape's own
 * name label, `GLabel`, `LABEL_NAME`, the label-edit handler - and none of them are this. It is offered
 * in the palette as `Label`, which is what it is to the person placing one.
 */
@Glsp.toolPalette({
    section: 'Annotation',
    label: 'Label',
    icon: 'uml-string-expression-icon'
})
@Glsp.defaults
export class TextLabel extends Node {
    /**
     * What the label says. Opens holding the word `Label` for the reason a note opens holding `Note`:
     * the element is only its text, so an empty one is nothing at all - no mark on the canvas to find it
     * by, and nothing to double-click to start writing in.
     */
    @Language.text body?: string = 'Label';
}
