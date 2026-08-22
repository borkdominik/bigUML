/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { CommonModelTypes } from '@borkdominik-biguml/uml-glsp-server';
import { GLabelElement } from '@borkdominik-biguml/uml-glsp-server/jsx';
import type { GModelElement } from '@eclipse-glsp/server';

/**
 * The writing on the two elements that are writing and nothing else: a note, and a label standing on its
 * own.
 *
 * Both hold a `body` and no name, both take whatever the grammar can lex rather than notation in a fixed
 * shape (see `storableProse`), and both are read a line at a time at whatever width they are drawn.
 * What differs between them is only what is drawn around the writing, so that is all their own elements
 * do.
 */

/**
 * What the id of such an element's one label ends in.
 *
 * A label's id is its element's id with a suffix naming the label, which is what
 * `GenericLabelEditOperationHandler` trims back to find the element a retyped line belongs to. It names
 * the body here rather than the name these elements have none of.
 */
export const BODY_LABEL_SUFFIX = '_body_label';

/**
 * What one character of the body takes across, near enough.
 *
 * An estimate of something only the client can measure, and it buys the one thing the client cannot do
 * for itself: decide where the text breaks. Wrapping happens before anything is laid out, so there is no
 * measured width to break against - `GEditableLabelView` is handed a column count worked out from this
 * and the width the shape is drawn at. A character narrower than the truth is the safe direction to be
 * wrong in: the line breaks a word early rather than running out past the edge.
 */
const PROSE_CHAR_WIDTH = 7;

/**
 * How many characters fit on one line across `room` pixels.
 *
 * At least one, because a column count of zero would leave the wrap with no line it could ever put a
 * word on.
 */
export function proseColumns(room: number): number {
    return Math.max(1, Math.floor(room / PROSE_CHAR_WIDTH));
}

export interface ProseLabelProps {
    /** The element the writing belongs to; the label takes its id with {@link BODY_LABEL_SUFFIX}. */
    id: string;
    /** What is written, already fallen back to a placeholder where nothing is stored. */
    text: string;
    /** How many characters go on a line, from {@link proseColumns}. */
    columns: number;
}

/**
 * The one label such an element carries.
 *
 * `LABEL_NAME` rather than `LABEL_TEXT` because that is the type bound to the editable label - these are
 * written by typing on them, and a plain text label cannot be typed on. The wrap is asked for by column
 * count rather than left to the client: it happens before the layout has measured anything, so the width
 * has to come from the model side.
 */
export function ProseLabel(props: ProseLabelProps): GModelElement {
    return (
        <GLabelElement
            id={props.id + BODY_LABEL_SUFFIX}
            type={CommonModelTypes.LABEL_NAME}
            text={props.text}
            args={{ wrapAtColumns: props.columns }}
        />
    );
}
