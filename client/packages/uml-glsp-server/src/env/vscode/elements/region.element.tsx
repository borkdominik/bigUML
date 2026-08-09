/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { GNodeElement } from '@borkdominik-biguml/uml-glsp-server/jsx';
import type { Region } from '@borkdominik-biguml/uml-model-server/grammar';
import type { Dimension } from '@eclipse-glsp/protocol';
import type { GModelElement } from '@eclipse-glsp/server';
import { FrameNameTag } from './core/index.js';
import type { BaseElementProps, ElementContext } from './core/element-context.js';

export interface GRegionNodeElementProps extends BaseElementProps {
    node: Region;
}

/**
 * What a region that carries no bounds of its own opens at. A region divides the frame that owns it, so
 * it opens wide and shallow - the shape a horizontal division of a state machine takes.
 */
const DEFAULT_REGION_SIZE = { width: 400, height: 200 };

/** The smallest a region is drawn or dragged to, so it cannot be lost behind its own name. */
const MIN_REGION_SIZE = { width: 120, height: 60 };

/** Inset of the region name from the region border. */
const REGION_PADDING = 8;

/**
 * A `Size` metaInfo can exist while carrying no usable dimensions (see `GenericChangeBoundsOperationHandler`),
 * which a plain `?? default` would happily accept - and the client layouter then collapses the region onto its
 * name label because its preferred size resolves to 0. So only positive dimensions count as a persisted size.
 */
function regionSize(size: BaseElementProps['size']): Dimension {
    if (!size?.width || !size?.height || size.width <= 0 || size.height <= 0) {
        return DEFAULT_REGION_SIZE;
    }
    return {
        width: Math.max(size.width, MIN_REGION_SIZE.width),
        height: Math.max(size.height, MIN_REGION_SIZE.height)
    };
}

export function GRegionNodeElement(props: GRegionNodeElementProps): GModelElement {
    const size = regionSize(props.size);

    return (
        <GNodeElement
            id={props.node.__id}
            type={props.type}
            position={props.position}
            size={size}
            cssClasses={['uml-node', 'uml-region-node']}
            layout='vbox'
            // Held at its size the same way the state machine frame is: the client re-layouts this node
            // (`needsClientLayout`) and would otherwise shrink it back onto its name label. `prefWidth`
            // and `prefHeight` hold a layouted node at a size without being read as a resize limit;
            // `minWidth`/`minHeight` are the floor a resize may not be dragged past.
            layoutOptions={{
                hAlign: 'left',
                paddingTop: REGION_PADDING,
                paddingBottom: REGION_PADDING,
                paddingLeft: REGION_PADDING,
                paddingRight: REGION_PADDING,
                minWidth: MIN_REGION_SIZE.width,
                minHeight: MIN_REGION_SIZE.height,
                prefWidth: size.width,
                prefHeight: size.height
            }}
        >
            {/* No tag at all on a region whose name has been cleared - a frame labelled `Region` says
                only that it is a frame, which the frame already says. The size is held by the layout
                options above rather than by this child, so dropping it collapses nothing. */}
            {props.node.name ? <FrameNameTag id={props.node.__id} name={props.node.name} /> : undefined}
        </GNodeElement>
    );
}

export function createRegionElement(ctx: ElementContext<Region>): GModelElement {
    const position = ctx.modelIndex.findPosition(ctx.node.__id);
    const size = ctx.modelIndex.findSize(ctx.node.__id);
    return <GRegionNodeElement node={ctx.node} position={position} size={size} type={ctx.elementType} />;
}
