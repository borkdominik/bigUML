/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
/** @jsx svg */
import { OUTSIDE_LABEL_ARG } from '@borkdominik-biguml/uml-glsp-server';
import { type ArgsAware, type Dimension, type GModelElement, svg } from '@eclipse-glsp/client';
import { type VNode } from 'snabbdom';

/** Distance between a shape and the name written next to it. */
const LABEL_GAP = 8;

/**
 * Which side of the shape the name is written on.
 *
 * `above-left` and `above-right` sit above it like `above` does, but run outwards from the near edge
 * instead of spreading either side of the middle. That is what a name beside a pin needs: a pin sits on
 * the boundary of an action, and a centred name would grow back across the action it belongs to.
 */
export type LabelSide = 'left' | 'above' | 'above-left' | 'above-right' | 'below';

/**
 * Draws a node's name clear of the shape rendered for it.
 *
 * The small shapes of a state machine - a fork/join bar a few pixels across, a choice diamond - have
 * no room for a name inside them, and one laid out within their bounds spills out over the edges.
 *
 * The name is written straight into the view instead of being a child element, and that is not just
 * convenience: `HiddenBoundsUpdater` measures a node's size from the bounding box of everything the
 * view renders, and the layouter only overrides that measurement for a *layout container*. A child
 * label placed outside the shape would therefore be measured into the node's own size, and since it
 * is placed relative to that size, every render would grow the node again. Text anchoring does the
 * placement here, so nothing has to be measured to position it.
 */
export function outsideLabel(element: GModelElement & Partial<ArgsAware>, size: Dimension, side: LabelSide): VNode | undefined {
    // Read straight off `args` rather than through `hasArgs`, which gates on an `argsFeature` that
    // `NamedElement` does not declare - the same way `NamedElementView` reads its own args.
    const text = element.args?.[OUTSIDE_LABEL_ARG];
    if (typeof text !== 'string' || text.length === 0) {
        return undefined;
    }

    const position = anchorFor(size, side);
    return (
        <text
            class-uml-outside-label={true}
            x={position.x}
            y={position.y}
            style-text-anchor={position.anchor}
            style-dominant-baseline={position.baseline}
        >
            {text}
        </text>
    ) as any;
}

/**
 * Anchoring rather than measuring: the text is hung off a point on the shape and SVG works out which
 * way to grow it, so the view never needs to know how wide the name renders.
 */
function anchorFor(size: Dimension, side: LabelSide): { x: number; y: number; anchor: string; baseline: string } {
    switch (side) {
        case 'left':
            return { x: -LABEL_GAP, y: size.height / 2, anchor: 'end', baseline: 'central' };
        case 'above':
            return { x: size.width / 2, y: -LABEL_GAP, anchor: 'middle', baseline: 'auto' };
        // Hung off the far edge and grown away from the shape: the text ends where the shape's right side
        // is, or starts where its left side is, so it never reaches back over what the shape sits on.
        case 'above-left':
            return { x: size.width, y: -LABEL_GAP, anchor: 'end', baseline: 'auto' };
        case 'above-right':
            return { x: 0, y: -LABEL_GAP, anchor: 'start', baseline: 'auto' };
        case 'below':
            return { x: size.width / 2, y: size.height + LABEL_GAP, anchor: 'middle', baseline: 'hanging' };
    }
}
