/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { OUTSIDE_LABEL_ARG } from '@borkdominik-biguml/uml-glsp-server';
import { GNodeElement } from '@borkdominik-biguml/uml-glsp-server/jsx';
import type { Dimension } from '@eclipse-glsp/protocol';
import type { GModelElement } from '@eclipse-glsp/server';
import type { BaseElementProps } from './element-context.js';

/**
 * The pseudostates drawn as a small mark of their own rather than as a shape holding a name - the two
 * histories, the two points on a state's border, and the terminate cross. Built in one place so they
 * cannot drift apart, the way the diamonds and the bars had.
 */

/** Such a pseudostate is a mark and nothing else, so it opens at the size that mark needs and no more. */
const DEFAULT_MARK_SIZE = { width: 30, height: 30 };

/** Below this the mark could no longer be grabbed to resize it back. */
const MIN_MARK_EXTENT = 12;

export interface GPseudostateMarkNodeElementProps extends BaseElementProps {
    id: string;
    name?: string;
}

/**
 * The square the mark is drawn in, taken from what the model holds for the element.
 *
 * Squared rather than taken as it stands, because these bounds are what a transition anchors to and the
 * mark inside them is drawn to the shorter side: at the 80 by 30 every node used to be created at, a
 * circle is drawn 30 across in the middle of a box nearly three times as wide, and a transition arriving
 * from the side stops on the box - 25 pixels clear of the shape. Files written before
 * `NODE_SIZE_OVERRIDES` gave these a square of their own still hold that size, so it is squared here
 * rather than only at creation.
 *
 * A `Size` metaInfo can also exist while carrying no usable dimensions (see
 * `GenericChangeBoundsOperationHandler`), which a plain `?? default` would happily accept - and the
 * client layouter then collapses the circle to nothing because its preferred size resolves to 0.
 */
function markSize(size: BaseElementProps['size']): Dimension {
    if (!size?.width || !size?.height || size.width <= 0 || size.height <= 0) {
        return DEFAULT_MARK_SIZE;
    }
    // The smaller of the two: the mark is drawn to the shorter side either way, so this is the square it
    // already occupies rather than a size the shape has to grow into.
    const extent = Math.min(size.width, size.height);
    return { width: extent, height: extent };
}

export function GPseudostateMarkNodeElement(props: GPseudostateMarkNodeElementProps): GModelElement {
    const size = markSize(props.size);

    return (
        <GNodeElement
            id={props.id}
            type={props.type}
            position={props.position}
            size={size}
            cssClasses={['uml-node']}
            args={{ [OUTSIDE_LABEL_ARG]: props.name ?? '' }}
            // The name is drawn beside the mark by the view rather than laid out inside it. A label
            // child would be measured into the node's own size by the layouter and stretch a circle 30
            // across to the width of the name - and the name previously defaulted to the literal
            // `DeepHistory`, so an unnamed one did exactly that. The `layout` still matters though:
            // `HiddenBoundsUpdater` sizes every node from the bounding box of what its view renders, and
            // only a layout container gets that measurement overridden - without one the name drawn
            // outside would be measured in, and the node would grow on every single render.
            layout='vbox'
            layoutOptions={{
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 0,
                paddingRight: 0,
                minWidth: MIN_MARK_EXTENT,
                minHeight: MIN_MARK_EXTENT,
                prefWidth: size.width,
                prefHeight: size.height
            }}
        />
    );
}
