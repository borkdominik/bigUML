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
import { connectionPorts } from './connection-ports.js';
import type { BaseElementProps } from './element-context.js';

/**
 * The branch points UML draws as a diamond - a choice on the state machine, a decision or a merge on
 * the activity diagram. Built in one place so that the three cannot drift apart, the way their client
 * views had.
 */

/** A branch diamond is small by convention: the guards belong on the outgoing edges, not inside it. */
const DEFAULT_DIAMOND_SIZE = { width: 40, height: 40 };

/** Below this the diamond could no longer be grabbed to resize it back. */
const MIN_DIAMOND_EXTENT = 12;

export interface GDiamondNodeElementProps extends BaseElementProps {
    id: string;
    name?: string;
    /**
     * Whether to offer the four tips as connection points an edge can be pinned to.
     *
     * All three diamonds ask for them. Both edges that run between diamonds can record the pin - a
     * transition in `sourcePoint`/`targetPoint`, and a control flow in fields of its own added to match.
     */
    connectionPoints?: boolean;
}

function diamondSize(size: BaseElementProps['size']): Dimension {
    if (!size?.width || !size?.height || size.width <= 0 || size.height <= 0) {
        return DEFAULT_DIAMOND_SIZE;
    }
    return { width: size.width, height: size.height };
}

export function GDiamondNodeElement(props: GDiamondNodeElementProps): GModelElement {
    const size = diamondSize(props.size);

    return (
        <GNodeElement
            id={props.id}
            type={props.type}
            position={props.position}
            size={size}
            cssClasses={['uml-node']}
            args={{ [OUTSIDE_LABEL_ARG]: props.name ?? '' }}
            // The name is drawn beside the shape by the view rather than laid out inside it, so this node
            // has no label child - one would be measured into the node's own size by the layouter and
            // stretch the shape to the width of a name that is not in it. The `layout` still matters
            // though: `HiddenBoundsUpdater` sizes every node from the bounding box of what its view
            // renders, and only a layout container gets that measurement overridden - without one the
            // name drawn outside would be measured in, and the node would grow on every single render.
            layout='vbox'
            layoutOptions={{
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 0,
                paddingRight: 0,
                minWidth: MIN_DIAMOND_EXTENT,
                minHeight: MIN_DIAMOND_EXTENT,
                prefWidth: size.width,
                prefHeight: size.height
            }}
        >
            {/* Ports are not laid out - `GPort` has no layoutable-child feature - so the vbox above
                leaves them on the tips this places them on. */}
            {props.connectionPoints ? connectionPorts(props.id, size, 'diamond') : undefined}
        </GNodeElement>
    );
}
