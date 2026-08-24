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
     * How deep this state holds each of its regions, which is what the box has to be tall enough to hold
     * as many of as it has. Worked out by `createStateElement` from the state's stored `regionHeight`;
     * left out, a region at its default depth is assumed.
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
 * What one written line takes, near enough - the state's name, and each of the parts under it.
 *
 * An estimate of something only the client can measure, and it is used for one purpose: working out how
 * much of a state's height is left over for its bands. Being a line or two out means a resize settles a
 * few pixels off where it was dropped; being wrong by the whole of the parts compartment, which a flat
 * allowance was, means every resize lands somewhere else entirely.
 */
const STATE_LINE_HEIGHT = 19;

/**
 * The room a composite state keeps above its bands: its padding, the name across the top, and the parts
 * written under it where it has any.
 *
 * Counted from what the state actually holds rather than allowed for as a flat number, because this is
 * what a drag on the state's own handles is divided by - see `regionHeightWithin`. A guess that is short
 * by the height of the parts compartment hands that much extra to the bands, and the box then comes back
 * taller than it was dropped; a state with two parts crept every time it was resized.
 */
function compositeStateHeaderAllowance(node: State): number {
    const parts = node.parts?.length ?? 0;
    // A compartment given a height of its own is drawn at that height where it is the larger of the two;
    // it is never drawn smaller than the lines in it, whatever height it was given.
    const partsRoom = parts > 0 ? Math.max(node.partsHeight ?? 0, parts * STATE_LINE_HEIGHT) : 0;
    return 2 * STATE_PADDING + STATE_LINE_HEIGHT + partsRoom;
}

/** Inset of the state name from the state border. */
const STATE_PADDING = 8;

/**
 * The depth each band takes when a state of `stateHeight` is divided into as many of them as `node`
 * has regions.
 *
 * The inverse of `compositeStateHeight`, and what a drag on the state's own handles is turned into: the
 * bands are what the box is made of, so stretching the box stretches them rather than leaving them at
 * the depth they had and opening a gap. Whole pixels, because the height is stored as an integer, and
 * rounded down so that the bands can never add up to more than the box the user just drew.
 */
export function regionHeightWithin(stateHeight: number, node: State): number {
    const regionCount = node.regions?.length ?? 0;
    if (regionCount <= 0) {
        return DEFAULT_REGION_BAND_HEIGHT;
    }
    const room = stateHeight - compositeStateHeaderAllowance(node);
    return Math.max(MIN_REGION_BAND_HEIGHT, Math.floor(room / regionCount));
}

/**
 * The room a composite state needs to hold each of its regions at `bandHeight`, plus what is written
 * above them.
 *
 * This is a floor and not merely a starting size: a state is the box its bands divide, so its height is
 * their height added up. Adding a region to a state therefore opens the state by a band's worth rather
 * than sharing out what was already there between one more of them - which is what left a state with two
 * regions drawing both of them a few pixels deep.
 *
 * It is also what a drag on a band comes back out as. The bands themselves are drawn at their share of
 * whatever height the state has (see `MIN_REGION_BAND_HEIGHT`), so a band cannot be made deeper or
 * shallower on its own - the state it divides is resized to the depth that was asked for, and the bands
 * follow from that.
 */
function compositeStateHeight(node: State, bandHeight: number, regionCount = node.regions?.length ?? 0): number {
    return compositeStateHeaderAllowance(node) + regionCount * bandHeight;
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
function stateSize(size: BaseElementProps['size'], node: State, bandHeight: number): Dimension {
    const composite = (node.regions?.length ?? 0) > 0;
    const width = size?.width && size.width > 0 ? size.width : composite ? DEFAULT_COMPOSITE_STATE_WIDTH : DEFAULT_STATE_SIZE.width;
    const stored = size?.height && size.height > 0 ? size.height : 0;

    if (!composite) {
        return { width, height: stored > 0 ? stored : DEFAULT_STATE_SIZE.height };
    }
    return { width, height: Math.max(stored, compositeStateHeight(node, bandHeight)) };
}

/**
 * The size a composite state has to be drawn at for each of its regions to come out `bandHeight` deep:
 * the width it already has, and the height that many bands of that depth add up to.
 *
 * Exactly that height rather than at least it, because this is the answer to a drag on a band - and a
 * band dragged shallower has to bring the state down with it, which `stateSize`'s floor would not do.
 */
export function stateSizeForBands(size: BaseElementProps['size'], node: State, bandHeight: number): Dimension {
    return { width: stateSize(size, node, bandHeight).width, height: compositeStateHeight(node, bandHeight) };
}

/**
 * The size a state opens at when it is given a region: wide enough to draw substates side by side in,
 * and deep enough for the bands it now has at their default depth.
 *
 * A state is created as a box holding a name and it stores that size from the moment it is drawn, so the
 * width it carries is the width of a box holding a name - and `stateSize` keeps a stored width whatever
 * it is, as it must. A state given a region is no longer that box though: it is the frame its substates
 * stand inside, and it has to open into one at the point it becomes one. Left at what it was, the first
 * region turned a state into a 160-wide slot nothing would fit in, and every composite state had to be
 * dragged out by hand before it could be used.
 *
 * Never smaller in either direction than what the state already is: a frame someone has widened stays
 * widened when the next region is added to it.
 *
 * `regionCount` is passed in rather than read off the state because this is worked out while the region
 * is being added - the state does not hold it yet.
 */
export function stateSizeWithRegions(size: BaseElementProps['size'], node: State, regionCount: number): Dimension {
    const bandHeight = regionBandHeight(node.regionHeight);
    return {
        width: Math.max(size?.width ?? 0, DEFAULT_COMPOSITE_STATE_WIDTH),
        height: Math.max(size?.height ?? 0, compositeStateHeight(node, bandHeight, regionCount))
    };
}

export function GStateNodeElement(props: GStateNodeElementProps): GModelElement {
    const regions = props.node.regions ?? [];
    const composite = regions.length > 0;
    // Measured against a region at its default depth. `createStateElement` works the real one out from
    // the state's stored `regionHeight`; what matters here is only that the box opens with room for its
    // regions rather than with them already squeezed. The bands take their depth from the box in either
    // case - they are drawn at their share of it, not at a height given to them.
    const size = stateSize(props.size, props.node, props.bandHeight ?? DEFAULT_REGION_BAND_HEIGHT);

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
    // state. Their width is the room inside the state's borders, which is what they open at; their
    // depth is not given to them at all, but taken as an equal share of the state they divide.
    const regions = ctx.node.regions ?? [];
    // One depth for all of them, held by the state rather than by each region - see `regionBandHeight`.
    const bandHeight = regionBandHeight(ctx.node.regionHeight);
    const bandWidth = stateSize(size, ctx.node, bandHeight).width - 2 * STATE_PADDING;
    const regionBands = regions.map((region, index) => <GStateRegionCompartment node={region} divided={index > 0} width={bandWidth} />);

    return (
        <GStateNodeElement node={ctx.node} position={position} size={size} bandHeight={bandHeight} type={ctx.elementType}>
            {partsSection}
            {regionBands}
        </GStateNodeElement>
    );
}
