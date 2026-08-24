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
import { CompartmentHeader } from './core/index.js';
import type { BaseElementProps, ElementContext } from './core/element-context.js';

export interface GRegionNodeElementProps extends BaseElementProps {
    node: Region;
}

/**
 * What a region that carries no bounds of its own opens at. A region divides the frame that owns it and
 * is the area a row of states is drawn on, so it opens wide and shallow - room for three or four states
 * side by side with the transitions between them, which is what one is added to hold. Kept in sync with
 * the entry `GenericCreateNodeOperationHandler` writes for a newly drawn region.
 */
const DEFAULT_REGION_SIZE = { width: 600, height: 240 };

/**
 * The smallest a region is drawn or dragged to. Not merely bigger than its own name: a region is a
 * boundary other shapes stand inside, and one dragged down to the size of a label has nowhere left to
 * put them.
 */
const MIN_REGION_SIZE = { width: 240, height: 120 };

/** Inset of the region name from the region border. */
const REGION_PADDING = 8;

/**
 * A `Size` metaInfo can exist while carrying no usable dimensions (see `GenericChangeBoundsOperationHandler`),
 * which a plain `?? default` would happily accept - and the client layouter then collapses the region onto its
 * name label because its preferred size resolves to 0. So only positive dimensions count as a persisted size.
 *
 * One smaller than the floor is not one either. A resize cannot be dragged past `MIN_REGION_SIZE`, so
 * anything below it was never chosen by anyone - it is what a region written before
 * `NODE_SIZE_OVERRIDES` gave the type a size of its own still carries, the generic 80 by 30 every node
 * used to be created at. Clamping that to the floor would leave those regions at a size nothing fits in;
 * they open at the default instead, and a size someone did drag is kept exactly as it stands.
 */
function regionSize(size: BaseElementProps['size']): Dimension {
    if (!size?.width || !size?.height || size.width < MIN_REGION_SIZE.width || size.height < MIN_REGION_SIZE.height) {
        return DEFAULT_REGION_SIZE;
    }
    return { width: size.width, height: size.height };
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
                // The name is written across the top of the region rather than tucked into a corner tag,
                // so it is centred the way a state writes its own - see `RegionNodeView`, which rules the
                // box off under it.
                hAlign: 'center',
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
            {/* The same header a class writes its name in, so a region is titled the way every other
                named box in the editor is - centred, bold, and renamed by typing on it through the
                `_name_label` id it carries. No header at all on a region whose name has been cleared: a
                box labelled `Region` says only that it is a box, which the box already says, and without
                one there is nothing for the view to rule off either. The size is held by the layout
                options above rather than by this child, so dropping it collapses nothing. */}
            {props.node.name ? <CompartmentHeader id={props.node.__id} name={props.node.name} /> : undefined}
        </GNodeElement>
    );
}

export function createRegionElement(ctx: ElementContext<Region>): GModelElement {
    const position = ctx.modelIndex.findPosition(ctx.node.__id);
    const size = ctx.modelIndex.findSize(ctx.node.__id);
    return <GRegionNodeElement node={ctx.node} position={position} size={size} type={ctx.elementType} />;
}
