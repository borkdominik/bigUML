/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { getDefaultSize } from '@borkdominik-biguml/uml-glsp-server/gen/vscode';
import type { State } from '@borkdominik-biguml/uml-model-server/grammar';
import type { Dimension } from '@eclipse-glsp/protocol';
import { hasUsableSize, type StoredSize } from './node-size.js';

/**
 * The geometry of a composite state: how its box, the bands its regions are drawn as, and the depth
 * stored for them relate. Shared by the state's renderer (which draws the box and the bands) and the
 * mutation that resizes a state or drags a band (which stores what the box and the bands come out as).
 */

/**
 * How deep a band opens: room for a substate, since that is what a region is added to hold - a band cut
 * to its own name would have to be dragged open before anything could be put on it.
 *
 * A little over the height a state is drawn at, and no more. A band is a row of the state that owns it
 * rather than a canvas a whole nested machine is laid out on, and a state divided into two or three of
 * them still has to read as a shape on the diagram.
 */
export const DEFAULT_REGION_BAND_HEIGHT = 80;

/**
 * The depth every band asks for, and the shallowest one is drawn at.
 *
 * Not what a band is drawn at: the room a state has over and above its name is shared out between its
 * bands by `vGrab`, and a band is drawn at its share of that. What this number fixes is the floor of it.
 * The client will not let a box be resized below what it holds, so whatever the bands ask for is added
 * up into the smallest a composite state can be dragged to. One row of text, so that a band carrying
 * its region's name measures the same as one carrying nothing.
 *
 * It is also the line below which a stored depth is not believed, which is why it is not 0.
 */
export const MIN_REGION_BAND_HEIGHT = 36;

/**
 * What a state opens at once it has a region: a frame its substates are drawn inside rather than a box
 * holding a name, so it opens at the size of something that has to contain them. Wide enough for two
 * substates side by side with a transition between them.
 */
const DEFAULT_COMPOSITE_STATE_WIDTH = 420;

/**
 * What one written line takes, near enough - the state's name, and each of the parts under it. An
 * estimate of something only the client can measure, used for one purpose: working out how much of a
 * state's height is left over for its bands.
 */
const STATE_LINE_HEIGHT = 19;

/** Inset of the state name from the state border. */
export const STATE_PADDING = 8;

/**
 * The one depth a state is opened to hold each of its regions at: what it stores in `regionHeight`, or
 * the default where it stores nothing usable. One number for all of them because the regions of a state
 * are equals - they divide the same box and run side by side down it.
 */
export function regionBandHeight(regionHeight: number | undefined): number {
    return regionHeight && regionHeight >= MIN_REGION_BAND_HEIGHT ? regionHeight : DEFAULT_REGION_BAND_HEIGHT;
}

/**
 * The room a composite state keeps above its bands: its padding, the name across the top, and the parts
 * written under it where it has any. Counted from what the state actually holds rather than allowed for
 * as a flat number, because this is what a drag on the state's own handles is divided by.
 */
function compositeStateHeaderAllowance(node: State): number {
    const parts = node.parts?.length ?? 0;
    // A compartment given a height of its own is drawn at that height where it is the larger of the two;
    // it is never drawn smaller than the lines in it, whatever height it was given.
    const partsRoom = parts > 0 ? Math.max(node.partsHeight ?? 0, parts * STATE_LINE_HEIGHT) : 0;
    return 2 * STATE_PADDING + STATE_LINE_HEIGHT + partsRoom;
}

/**
 * The depth each band takes when a state of `stateHeight` is divided into as many of them as `node` has
 * regions. The inverse of {@link compositeStateHeight}, and what a drag on the state's own handles is
 * turned into. Whole pixels, rounded down so that the bands can never add up to more than the box.
 */
export function regionHeightWithin(stateHeight: number, node: State): number {
    const regionCount = node.regions?.length ?? 0;
    if (regionCount <= 0) {
        return DEFAULT_REGION_BAND_HEIGHT;
    }
    const room = stateHeight - compositeStateHeaderAllowance(node);
    return Math.max(MIN_REGION_BAND_HEIGHT, Math.floor(room / regionCount));
}

/** The room a composite state needs to hold each of its regions at `bandHeight`, plus what is written above them. */
function compositeStateHeight(node: State, bandHeight: number, regionCount = node.regions?.length ?? 0): number {
    return compositeStateHeaderAllowance(node) + regionCount * bandHeight;
}

/**
 * The size a state is drawn at. A composite state is held to the height its bands add up to: dragging
 * one taller still works and is kept; dragging it shorter than its own contents does not.
 */
export function stateSize(size: StoredSize, node: State, bandHeight: number): Dimension {
    const composite = (node.regions?.length ?? 0) > 0;
    const defaultSize = getDefaultSize('State');
    const width = size?.width && size.width > 0 ? size.width : composite ? DEFAULT_COMPOSITE_STATE_WIDTH : defaultSize.width;
    const stored = size?.height && size.height > 0 ? size.height : 0;

    if (!composite) {
        return { width, height: stored > 0 ? stored : defaultSize.height };
    }
    return { width, height: Math.max(stored, compositeStateHeight(node, bandHeight)) };
}

/**
 * The size a composite state has to be drawn at for each of its regions to come out `bandHeight` deep:
 * the width it already has, and the height that many bands of that depth add up to. Exactly that height
 * rather than at least it, because this is the answer to a drag on a band - and a band dragged shallower
 * has to bring the state down with it.
 */
export function stateSizeForBands(size: StoredSize, node: State, bandHeight: number): Dimension {
    return { width: stateSize(size, node, bandHeight).width, height: compositeStateHeight(node, bandHeight) };
}

/**
 * The size a state opens at when it is given a region: wide enough to draw substates side by side in,
 * and deep enough for the bands it now has at their default depth. Never smaller in either direction
 * than what the state already is. `regionCount` is passed in because this is worked out while the
 * region is being added - the state does not hold it yet.
 */
export function stateSizeWithRegions(size: StoredSize, node: State, regionCount: number): Dimension {
    const bandHeight = regionBandHeight(node.regionHeight);
    return {
        width: Math.max(hasUsableSize(size) ? size.width : 0, DEFAULT_COMPOSITE_STATE_WIDTH),
        height: Math.max(hasUsableSize(size) ? size.height : 0, compositeStateHeight(node, bandHeight, regionCount))
    };
}
