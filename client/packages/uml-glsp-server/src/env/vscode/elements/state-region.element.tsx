/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { CommonModelTypes } from '@borkdominik-biguml/uml-glsp-server';
import { GCompartmentElement, GLabelElement } from '@borkdominik-biguml/uml-glsp-server/jsx';
import type { Region } from '@borkdominik-biguml/uml-model-server/grammar';
import type { GModelElement } from '@eclipse-glsp/server';

/**
 * One region of a composite state: the band inside the state box that its substates are drawn on.
 *
 * A band rather than a shape of its own, the way a swimlane holds its lanes (see
 * `GActivityPartitionNodeElement`). The state lays the bands out and draws the rules between them, so a
 * region cannot be dragged out of the state that owns it, left behind when it moves, or resized away
 * from its neighbour. What is drawn *on* a band is not held by it though: a substate is a flat entity of
 * the diagram positioned over the band, which is how every frame in this editor contains anything - see
 * `FLAT_CONTAINER_TYPES`.
 *
 * The band carries the region's own id, so clicking it selects the region, the keyboard deletes it, and
 * the state's property panel can navigate into it - all of which go by the id of an element the index
 * knows.
 */

/**
 * How deep a band opens: room for a substate, since that is what a region is added to hold - a band cut
 * to its own name would have to be dragged open before anything could be put on it.
 *
 * A little over the height a state is drawn at, and no more. A band is a row of the state that owns it
 * rather than a canvas a whole nested machine is laid out on, and a state divided into two or three of
 * them still has to read as a shape on the diagram; deeper than this and a composite state opened as a
 * tower of empty space with its substates sitting along the top of it.
 */
export const DEFAULT_REGION_BAND_HEIGHT = 80;

/**
 * The depth every band asks for, and the shallowest one is drawn at.
 *
 * The same number for all of them whatever depth the state's regions are set to, because this is not
 * what a band is drawn at: the room a state has over and above its name is shared out between its bands
 * by `vGrab`, and a band is drawn at its share of that. What this number fixes is the floor of it. The
 * client will not let a box be resized below what it holds (`ChangeBoundsManager.getMinimumSize` reads
 * the size the layouter measured), so whatever the bands ask for is added up into the smallest a
 * composite state can be dragged to - and bands asking for the full depth of their region put that whole
 * depth into the floor, which left a state that could be dragged taller but never back down again.
 *
 * One row of text, so that a band carrying its region's name measures the same as one carrying nothing:
 * a container is never drawn smaller than what is written in it, and a name that pushed its own band
 * past this floor would take a larger share of the state than the band beside it.
 *
 * It is also the line below which a stored depth is not believed, which is why it is not 0: a region
 * carrying nothing usable was never adjusted, and its state opens at the default instead.
 */
export const MIN_REGION_BAND_HEIGHT = 36;

/**
 * The one depth a state is opened to hold each of its regions at: what it stores in `regionHeight`, or
 * the default where it stores nothing usable.
 *
 * One number for all of them because the regions of a state are equals - they divide the same box and
 * run side by side down it, and UML gives none of them a size of its own. It is kept on the state
 * rather than on the regions for that reason too: there is one depth, and it belongs to the state that
 * is divided. Dragging a band sets it, dragging the state sets it, and the property panel writes it
 * straight (see `GenericChangeBoundsOperationHandler` and the state's `Region Height` field).
 */
export function regionBandHeight(regionHeight: number | undefined): number {
    return regionHeight && regionHeight >= MIN_REGION_BAND_HEIGHT ? regionHeight : DEFAULT_REGION_BAND_HEIGHT;
}

/** Inset of the region's name from the band's corner. */
const BAND_PADDING = 4;

export interface GStateRegionCompartmentProps {
    node: Region;
    /** Whether a rule is drawn above this band, i.e. every band but the first. */
    divided: boolean;
    /** The width the band opens at, which is the room the state has inside its own borders. */
    width: number;
}

export function GStateRegionCompartment(props: GStateRegionCompartmentProps): GModelElement {
    const { node, divided, width } = props;

    return (
        <GCompartmentElement
            id={node.__id}
            type={CommonModelTypes.COMP_STATE_REGION}
            layout='vbox'
            cssClasses={['uml-state-region-band']}
            layoutOptions={{
                hAlign: 'left',
                paddingTop: BAND_PADDING,
                paddingBottom: BAND_PADDING,
                paddingLeft: BAND_PADDING,
                paddingRight: BAND_PADDING,
                // As wide as the state and sharing its height with the other bands. `prefWidth`/`prefHeight`
                // rather than a minimum, because a band holds nothing the layouter can measure - its
                // substates are drawn over it, not in it - and a compartment with no content of its own is
                // never given bounds at all, which collapsed the band and everything below it.
                hGrab: true,
                // What a band is drawn at. Every band asks for the same floor and `vGrab` shares out
                // everything the state has over and above its name equally between them, so the bands
                // are the box: dragging the state deepens all of them by the same amount and dragging it
                // back shallows them again, with no gap opening under the last one either way. Asking
                // for a band's full depth here instead is what stopped a composite state from ever being
                // dragged shorter - see `MIN_REGION_BAND_HEIGHT`.
                vGrab: true,
                prefWidth: Math.max(0, width),
                prefHeight: MIN_REGION_BAND_HEIGHT
            }}
            // Drawn by the state, which is the only element wide enough to run a rule across it. Dashed
            // between one region and the next, which is how UML separates the regions of an orthogonal
            // state - see `renderCompartmentSeparators`.
            args={divided ? { divider: true, dashed: true } : { divider: true }}
        >
            {/* `[G1]`, the way the notation writes a region's name. The brackets are notation and not
                data, so they are put on here rather than stored - and a region with no name gets no
                label at all rather than an empty pair of them. */}
            {node.name ? (
                <GLabelElement
                    id={node.__id + '_name_label'}
                    type={CommonModelTypes.LABEL_TEXT}
                    text={`[${node.name}]`}
                    cssClasses={['uml-font-member']}
                />
            ) : undefined}
        </GCompartmentElement>
    );
}
