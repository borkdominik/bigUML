/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { CommonModelTypes } from '@borkdominik-biguml/uml-glsp-server';
import { GLabelElement, GNodeElement, type GlspNode } from '@borkdominik-biguml/uml-glsp-server/jsx';
import type { State } from '@borkdominik-biguml/uml-model-server/grammar';
import type { Dimension } from '@eclipse-glsp/protocol';
import type { GModelElement } from '@eclipse-glsp/server';
import type { BaseElementProps, ElementContext } from './core/element-context.js';
import { SectionCompartment } from './core/index.js';
import { GStatePartNodeElement } from './state-part.element.js';
import { DEFAULT_REGION_BAND_HEIGHT, GStateRegionCompartment, MIN_REGION_BAND_HEIGHT, regionBandHeight } from './state-region.element.js';

export interface GStateNodeElementProps extends BaseElementProps {
    node: State;
    /**
     * How deep each of this state's bands is drawn, which is what the box has to be tall enough to hold
     * as many of as it has regions. Worked out by `createStateElement` from the regions themselves; left
     * out, a band at its default depth is assumed.
     */
    bandHeight?: number;
    /** The compartments under the name - the parts, and the region bands (see `createStateElement`). */
    children?: GlspNode;
}

/**
 * A state is drawn as a box holding its name, not as a chip cut to the name, so one that carries no
 * bounds of its own starts out at this size instead of collapsing onto the label. Kept in sync with
 * the entry `GenericCreateNodeOperationHandler` writes for a newly drawn state.
 */
const DEFAULT_STATE_SIZE = { width: 160, height: 70 };

/**
 * What a state opens at once it has a region: a frame its substates are drawn inside rather than a box
 * holding a name, so it opens at the size of something that has to contain them. Wide enough for two
 * substates side by side with a transition between them.
 */
const DEFAULT_COMPOSITE_STATE_WIDTH = 420;

/**
 * The room a composite state keeps above its bands, for the name and for a part or two written under it.
 * A rough allowance rather than a measurement: what the name and the parts actually take is known to the
 * client once they are laid out, and the state grows to whatever that turns out to be - this only has to
 * be near enough that a state does not open with its bands already squeezed.
 */
const COMPOSITE_STATE_HEADER_ALLOWANCE = 70;

/** Inset of the state name from the state border. */
const STATE_PADDING = 8;

/**
 * The depth each band takes when a state of `stateHeight` is divided into `regionCount` of them.
 *
 * The inverse of `compositeStateHeight`, and what a drag on the state's own handles is turned into: the
 * bands are what the box is made of, so stretching the box stretches them rather than leaving them at
 * the depth they had and opening a gap. Whole pixels, because the height is stored as an integer, and
 * rounded down so that the bands can never add up to more than the box the user just drew.
 */
export function regionHeightWithin(stateHeight: number, regionCount: number): number {
    if (regionCount <= 0) {
        return DEFAULT_REGION_BAND_HEIGHT;
    }
    return Math.max(MIN_REGION_BAND_HEIGHT, Math.floor((stateHeight - COMPOSITE_STATE_HEADER_ALLOWANCE) / regionCount));
}

/**
 * The room a composite state needs for `regionCount` bands of `bandHeight` each, plus what is written
 * above them.
 *
 * This is a floor and not merely a starting size: a state is the box its bands divide, so its height is
 * their height added up. Adding a region to a state therefore opens the state by a band's worth rather
 * than sharing out what was already there between one more of them - which is what left a state with two
 * regions drawing both of them a few pixels deep.
 */
function compositeStateHeight(regionCount: number, bandHeight: number): number {
    return COMPOSITE_STATE_HEADER_ALLOWANCE + regionCount * bandHeight;
}

/**
 * A `Size` metaInfo can exist while carrying no usable dimensions (see `GenericChangeBoundsOperationHandler`),
 * which a plain `?? default` would happily accept - and the client layouter then collapses the state onto its
 * name label because its preferred size resolves to 0. So only positive dimensions count as a persisted size.
 *
 * A composite state is held to the height its bands add up to on top of that. Dragging one taller still
 * works and is kept; dragging it shorter than its own contents does not, the way it does not for any
 * other box here - the client grows a container to fit what is in it whatever size it was given.
 */
function stateSize(size: BaseElementProps['size'], regionCount: number, bandHeight: number): Dimension {
    const composite = regionCount > 0;
    const width = size?.width && size.width > 0 ? size.width : composite ? DEFAULT_COMPOSITE_STATE_WIDTH : DEFAULT_STATE_SIZE.width;
    const stored = size?.height && size.height > 0 ? size.height : 0;

    if (!composite) {
        return { width, height: stored > 0 ? stored : DEFAULT_STATE_SIZE.height };
    }
    return { width, height: Math.max(stored, compositeStateHeight(regionCount, bandHeight)) };
}

export function GStateNodeElement(props: GStateNodeElementProps): GModelElement {
    const regions = props.node.regions ?? [];
    const composite = regions.length > 0;
    // Measured against a band at its default depth. `createStateElement` works the real one out from the
    // regions and hands the band that height directly; what matters here is only that the box opens with
    // room for them rather than with them already squeezed.
    const size = stateSize(props.size, regions.length, props.bandHeight ?? DEFAULT_REGION_BAND_HEIGHT);

    return (
        <GNodeElement
            id={props.node.__id}
            type={props.type}
            position={props.position}
            size={size}
            // A composite state is a frame its substates stand on rather than a filled box, so it is
            // marked as one for the stylesheet to take its fill back - see `uml-composite-state-node`.
            // Filled, a state drawn around substates that were already there would hide them, and
            // swallow every click inside its own bounds.
            cssClasses={composite ? ['uml-node', 'uml-composite-state-node'] : ['uml-node']}
            // A state is resized freely, so its name has to stay in the middle of the box at whatever
            // size it is dragged to - which plain `vbox` does not do (see `UmlCenteredVBoxLayouter`).
            layout='uml-centered-vbox'
            // The client re-layouts this node (`needsClientLayout`) and would otherwise shrink it back
            // onto its name label after every resize. `prefWidth`/`prefHeight` are GLSP's way of holding
            // a layouted node at a given size, and unlike `minWidth`/`minHeight` they are not read as a
            // resize limit - so the state can still be dragged smaller again, down to its own name.
            layoutOptions={{
                paddingTop: STATE_PADDING,
                paddingBottom: STATE_PADDING,
                paddingLeft: STATE_PADDING,
                paddingRight: STATE_PADDING,
                prefWidth: size.width,
                prefHeight: size.height
            }}
        >
            <GLabelElement
                id={props.node.__id + '_name_label'}
                type={CommonModelTypes.LABEL_TEXT}
                text={props.node.name}
                cssClasses={['uml-font-bold']}
            />
            {props.children}
        </GNodeElement>
    );
}

export function createStateElement(ctx: ElementContext<State>): GModelElement {
    const position = ctx.modelIndex.findPosition(ctx.node.__id);
    const size = ctx.modelIndex.findSize(ctx.node.__id);

    // The second compartment exists only where the state has a part: UML draws the divider to separate
    // the name from the lines under it, and a state with none is a plain named box.
    const parts = ctx.node.parts ?? [];
    const partsSection =
        parts.length > 0 ? (
            <SectionCompartment
                id={ctx.node.__id + '_parts'}
                type={CommonModelTypes.COMP_STATE_PARTS}
                height={ctx.node.partsHeight}
                divider
            >
                {parts.map(part => (
                    <GStatePartNodeElement node={part} />
                ))}
            </SectionCompartment>
        ) : null;

    // One band per region, stacked under the parts. The first is ruled off from what is above it and
    // the rest from one another - dashed, which is how UML separates the regions of an orthogonal
    // state. Their width is the room inside the state's borders, which is what they open at.
    const regions = ctx.node.regions ?? [];
    // One depth for all of them, held by the state rather than by each region - see `regionBandHeight`.
    const bandHeight = regionBandHeight(ctx.node.regionHeight);
    const bandWidth = stateSize(size, regions.length, bandHeight).width - 2 * STATE_PADDING;
    const regionBands = regions.map((region, index) => (
        <GStateRegionCompartment node={region} divided={index > 0} width={bandWidth} height={bandHeight} />
    ));

    return (
        <GStateNodeElement node={ctx.node} position={position} size={size} bandHeight={bandHeight} type={ctx.elementType}>
            {partsSection}
            {regionBands}
        </GStateNodeElement>
    );
}
