/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { NOTE_FOLD_SIZE } from '@borkdominik-biguml/uml-glsp-server';
import { GNodeElement } from '@borkdominik-biguml/uml-glsp-server/jsx';
import type { Note } from '@borkdominik-biguml/uml-model-server/grammar';
import type { Dimension } from '@eclipse-glsp/protocol';
import type { GModelElement } from '@eclipse-glsp/server';
import type { BaseElementProps, ElementContext } from './core/element-context.js';
import { ProseLabel, proseColumns } from './core/prose-text.js';

/**
 * A note: the piece of writing UML puts on a diagram to say something the notation cannot, drawn as the
 * box with its top right corner turned down.
 *
 * The corner is drawn by `GNoteNodeView` rather than laid out here, because it is the shape of the box
 * and not something standing in it - the text is inset clear of it by `NOTE_FOLD_SIZE`, which is the one
 * number both sides work from.
 *
 * A note is the text it holds and has no name, so the label it carries is the body and the id it carries
 * is `<id>_body_label` - which is what `GenericLabelEditOperationHandler` writes a retyped note back
 * through.
 */

/** Inset of the text from the note's border. */
const NOTE_PADDING = 8;

/**
 * What a note opens at. A block rather than a line, since prose is what goes in one - room for a few
 * words to a line and a few lines of them. Kept in sync with the entry
 * `GenericCreateNodeOperationHandler` writes for a newly drawn note.
 */
const DEFAULT_NOTE_SIZE = { width: 180, height: 90 };

/** Below this a note has no room for a word, and no corner left to grab it back by. */
const MIN_NOTE_SIZE = { width: 60, height: 40 };

/**
 * What is written in a note that holds nothing.
 *
 * A note is only its text, so an empty one is an empty box: nothing on the canvas to see it by, and -
 * since a note is written by typing on its label - nothing to click to start writing in it either. A
 * new note is created holding this word, so the fallback is only reached by a file that was emptied by
 * hand; it is a placeholder and is not stored, and typing over it stores what was typed.
 */
const EMPTY_NOTE_BODY = 'Note';

/**
 * A `Size` metaInfo can exist while carrying no usable dimensions (see `GenericChangeBoundsOperationHandler`),
 * which a plain `?? default` would happily accept - and the client layouter then collapses the note onto its
 * text because its preferred size resolves to 0. So only positive dimensions count as a persisted size.
 */
function noteSize(size: BaseElementProps['size']): Dimension {
    if (!size?.width || !size?.height || size.width <= 0 || size.height <= 0) {
        return DEFAULT_NOTE_SIZE;
    }
    return { width: size.width, height: size.height };
}

/** The room a note this wide leaves for its text: what is inside the borders, less the fold. */
function noteTextRoom(width: number): number {
    return width - 2 * NOTE_PADDING - NOTE_FOLD_SIZE;
}

export interface GNoteNodeElementProps extends BaseElementProps {
    node: Note;
}

export function GNoteNodeElement(props: GNoteNodeElementProps): GModelElement {
    const size = noteSize(props.size);

    return (
        <GNodeElement
            id={props.node.__id}
            type={props.type}
            position={props.position}
            size={size}
            cssClasses={['uml-node', 'uml-note-node']}
            layout='vbox'
            // The text starts at the top left and stays there, the way writing on a note does - a note
            // dragged taller is a note with room left under what is written on it, not one with its
            // text floating in the middle. `prefWidth`/`prefHeight` hold the box at the size it was
            // dragged to without being read as a resize limit, so it can still be taken back down;
            // `minWidth`/`minHeight` are the floor it may not be dragged past.
            layoutOptions={{
                hAlign: 'left',
                paddingTop: NOTE_PADDING,
                paddingBottom: NOTE_PADDING,
                paddingLeft: NOTE_PADDING,
                // The fold is drawn inside the note's own bounds, so the right side is padded out by it -
                // otherwise the first line runs in under the turned-down corner.
                paddingRight: NOTE_PADDING + NOTE_FOLD_SIZE,
                minWidth: MIN_NOTE_SIZE.width,
                minHeight: MIN_NOTE_SIZE.height,
                prefWidth: size.width,
                prefHeight: size.height
            }}
        >
            {/* The body, and the only thing a note holds. */}
            <ProseLabel id={props.node.__id} text={props.node.body ?? EMPTY_NOTE_BODY} columns={proseColumns(noteTextRoom(size.width))} />
        </GNodeElement>
    );
}

export function createNoteElement(ctx: ElementContext<Note>): GModelElement {
    const position = ctx.modelIndex.findPosition(ctx.node.__id);
    const size = ctx.modelIndex.findSize(ctx.node.__id);
    return <GNoteNodeElement node={ctx.node} position={position} size={size} type={ctx.elementType} />;
}
