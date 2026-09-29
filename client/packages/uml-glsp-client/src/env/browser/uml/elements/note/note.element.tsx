/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
/** @jsx svg */
import { NOTE_FOLD_SIZE } from '@borkdominik-biguml/uml-glsp-server';
import { svg } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { type VNode } from 'snabbdom';
import { NamedElement, NamedElementView } from '../named-element/index.js';

export class GNoteNode extends NamedElement {}

/**
 * A note, drawn as UML draws one: a box with its top right corner turned down, and the writing inside it.
 *
 * The corner is part of the outline rather than something laid over it - the shape's own top edge stops
 * short and the fold cuts across to the right side - so the note is the size it says it is and is picked
 * up, resized and clicked by the whole of what is drawn. The little triangle the fold leaves behind is
 * then filled in over the top, which is what makes the corner read as turned down rather than merely cut
 * off. Its contents are laid out clear of it by `NOTE_FOLD_SIZE`, which is the measure both sides work
 * from - see `GNoteNodeElement`.
 */
@injectable()
export class GNoteNodeView extends NamedElementView {
    protected override renderBackground(element: NamedElement): VNode {
        const width = Math.max(0, element.bounds.width);
        const height = Math.max(0, element.bounds.height);
        // Never more than the note has to give: a note dragged down to less than the fold in either
        // direction would otherwise have the corner cut back past its own opposite edge, turning the
        // outline inside out.
        const fold = Math.min(NOTE_FOLD_SIZE, width, height);

        return (
            <g>
                <path
                    class-uml-node-background
                    // The outline, with the top edge stopping `fold` short of the right side and the
                    // corner cutting down to it.
                    d={`M 0,0 H ${width - fold} L ${width},${fold} V ${height} H 0 Z`}
                />
                <path
                    class-uml-note-fold
                    // The turned-down corner itself: the triangle between where the top edge stopped and
                    // where the cut landed, closed back along the cut.
                    d={`M ${width - fold},0 V ${fold} H ${width} Z`}
                />
            </g>
        ) as any;
    }
}
