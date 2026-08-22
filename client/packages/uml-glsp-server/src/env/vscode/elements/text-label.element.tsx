/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { GNodeElement } from '@borkdominik-biguml/uml-glsp-server/jsx';
import type { TextLabel } from '@borkdominik-biguml/uml-model-server/grammar';
import type { Dimension } from '@eclipse-glsp/protocol';
import type { GModelElement } from '@eclipse-glsp/server';
import type { BaseElementProps, ElementContext } from './core/element-context.js';
import { ProseLabel, proseColumns } from './core/prose-text.js';

/**
 * A label: writing put on the diagram with nothing drawn around it.
 *
 * A note with the note taken away, and built from the same pieces - the same `body` of free text, the
 * same one editable label, the same wrap to whatever width it is drawn at (see `ProseLabel`). All that
 * is left out is the box, which is the whole point of it: a caption over a group of shapes or a heading
 * across the top of a diagram is worse for being in a frame.
 *
 * It still has bounds, though nothing marks them. They are what the writing wraps to and what a click
 * has to land on, so `GTextLabelNodeView` paints them in `transparent` rather than leaving them unpainted
 * - an unpainted shape takes no pointer events at all, and a label would then only be selectable by
 * hitting a letter.
 */

/**
 * Inset of the writing from the label's own bounds.
 *
 * Smaller than a note's, because there is no border for the writing to stand clear of - this is only the
 * slack that keeps a click near the text from missing it, and that keeps the outline shown on hover from
 * being drawn tight against the letters.
 */
const LABEL_PADDING = 6;

/**
 * What a label opens at: one line across, and no deeper than that line.
 *
 * Unlike a note it does not open as a block. A label is usually a few words, and one that opened three
 * lines deep would have to be dragged closed again every time - whereas one that needs a second line
 * simply grows onto it, since a box is never drawn smaller than what it holds. Kept in sync with the
 * entry `GenericCreateNodeOperationHandler` writes for a newly drawn label.
 */
const DEFAULT_LABEL_SIZE = { width: 160, height: 34 };

/** Below this a label has no room for a word, and nothing left to take hold of to drag it back. */
const MIN_LABEL_SIZE = { width: 40, height: 22 };

/**
 * What is written in a label that holds nothing.
 *
 * A label is only its text, so an empty one is nothing at all: no mark on the canvas to find it by, and
 * - since it is written by typing on its label - nothing to click to start writing in it either. A new
 * one is created holding this word, so the fallback is only reached by a file emptied by hand; it is a
 * placeholder and is not stored, and typing over it stores what was typed.
 */
const EMPTY_LABEL_BODY = 'Label';

/**
 * A `Size` metaInfo can exist while carrying no usable dimensions (see `GenericChangeBoundsOperationHandler`),
 * which a plain `?? default` would happily accept - and the client layouter then collapses the label onto its
 * text because its preferred size resolves to 0. So only positive dimensions count as a persisted size.
 */
function textLabelSize(size: BaseElementProps['size']): Dimension {
    if (!size?.width || !size?.height || size.width <= 0 || size.height <= 0) {
        return DEFAULT_LABEL_SIZE;
    }
    return { width: size.width, height: size.height };
}

export interface GTextLabelNodeElementProps extends BaseElementProps {
    node: TextLabel;
}

export function GTextLabelNodeElement(props: GTextLabelNodeElementProps): GModelElement {
    const size = textLabelSize(props.size);

    return (
        <GNodeElement
            id={props.node.__id}
            type={props.type}
            position={props.position}
            size={size}
            cssClasses={['uml-node', 'uml-text-label-node']}
            layout='vbox'
            // The writing starts at the top left and stays there, so a label dragged wider is a label
            // with room to its right rather than one whose text drifts to the middle. `prefWidth` and
            // `prefHeight` hold the bounds at the size they were dragged to without being read as a
            // resize limit; `minWidth`/`minHeight` are the floor they may not be dragged past.
            layoutOptions={{
                hAlign: 'left',
                paddingTop: LABEL_PADDING,
                paddingBottom: LABEL_PADDING,
                paddingLeft: LABEL_PADDING,
                paddingRight: LABEL_PADDING,
                minWidth: MIN_LABEL_SIZE.width,
                minHeight: MIN_LABEL_SIZE.height,
                prefWidth: size.width,
                prefHeight: size.height
            }}
        >
            <ProseLabel
                id={props.node.__id}
                text={props.node.body ?? EMPTY_LABEL_BODY}
                columns={proseColumns(size.width - 2 * LABEL_PADDING)}
            />
        </GNodeElement>
    );
}

export function createTextLabelElement(ctx: ElementContext<TextLabel>): GModelElement {
    const position = ctx.modelIndex.findPosition(ctx.node.__id);
    const size = ctx.modelIndex.findSize(ctx.node.__id);
    return <GTextLabelNodeElement node={ctx.node} position={position} size={size} type={ctx.elementType} />;
}
