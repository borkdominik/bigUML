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
 * The history pseudostates - shallow and deep - which are one small circle carrying a mark. Built in
 * one place so the two cannot drift apart, the way the diamonds and the bars had.
 */

/** A history pseudostate is a mark in a circle, so it opens at the size that mark needs and no more. */
const DEFAULT_HISTORY_SIZE = { width: 30, height: 30 };

/** Below this the circle could no longer be grabbed to resize it back. */
const MIN_HISTORY_EXTENT = 12;

export interface GHistoryNodeElementProps extends BaseElementProps {
    id: string;
    name?: string;
}

/**
 * A `Size` metaInfo can exist while carrying no usable dimensions (see `GenericChangeBoundsOperationHandler`),
 * which a plain `?? default` would happily accept - and the client layouter then collapses the circle to
 * nothing because its preferred size resolves to 0.
 */
function historySize(size: BaseElementProps['size']): Dimension {
    if (!size?.width || !size?.height || size.width <= 0 || size.height <= 0) {
        return DEFAULT_HISTORY_SIZE;
    }
    return { width: size.width, height: size.height };
}

export function GHistoryNodeElement(props: GHistoryNodeElementProps): GModelElement {
    const size = historySize(props.size);

    return (
        <GNodeElement
            id={props.id}
            type={props.type}
            position={props.position}
            size={size}
            cssClasses={['uml-node']}
            args={{ [OUTSIDE_LABEL_ARG]: props.name ?? '' }}
            // The name is drawn beside the circle by the view rather than laid out inside it. A label
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
                minWidth: MIN_HISTORY_EXTENT,
                minHeight: MIN_HISTORY_EXTENT,
                prefWidth: size.width,
                prefHeight: size.height
            }}
        />
    );
}
