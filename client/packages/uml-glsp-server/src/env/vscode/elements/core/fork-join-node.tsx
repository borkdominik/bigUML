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
 * A fork and a join are one bar across the flow - the same notation on the state machine, where they
 * are pseudostates, and on the activity diagram, where they are control nodes. Both are built here so
 * that the four elements cannot drift apart, the way their two client views had.
 */

/** A bar opens horizontal; drag it taller than it is wide to stand it up. */
const DEFAULT_FORK_JOIN_SIZE = { width: 120, height: 10 };

/** A bar thinner than this could no longer be grabbed to resize it back. */
const MIN_FORK_JOIN_EXTENT = 6;

export interface GForkJoinNodeElementProps extends BaseElementProps {
    id: string;
    name?: string;
    /**
     * Whether to offer the middle of each long face as a connection point an edge can be pinned to.
     *
     * All four bars ask for them. Both edges that run between bars can record the pin - a transition in
     * `sourcePoint`/`targetPoint`, and a control flow in fields of its own added for exactly this.
     */
    connectionPoints?: boolean;
}

/**
 * The stored bounds are handed straight through: which way the bar runs *is* its shape, and the view
 * reads that back off the bounds. Nothing normalises them here, because a bar dragged taller than it
 * is wide is a bar the user has stood up - rewriting that would undo the resize as it happened.
 */
function barSize(size: BaseElementProps['size']): Dimension {
    if (!size?.width || !size?.height || size.width <= 0 || size.height <= 0) {
        return DEFAULT_FORK_JOIN_SIZE;
    }
    return { width: size.width, height: size.height };
}

export function GForkJoinNodeElement(props: GForkJoinNodeElementProps): GModelElement {
    const size = barSize(props.size);

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
                minWidth: MIN_FORK_JOIN_EXTENT,
                minHeight: MIN_FORK_JOIN_EXTENT,
                prefWidth: size.width,
                prefHeight: size.height
            }}
        >
            {/* Ports are not laid out - `GPort` has no layoutable-child feature - so the vbox above
                leaves them on the faces this places them on. */}
            {props.connectionPoints ? connectionPorts(props.id, size, 'bar') : undefined}
        </GNodeElement>
    );
}
