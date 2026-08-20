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
 * How deep a band opens. Room for a substate with a compartment or two and the transitions between
 * them, since that is what a region is added to hold - a band cut to its own name would have to be
 * dragged open before anything could be put on it.
 */
export const DEFAULT_REGION_BAND_HEIGHT = 120;

/**
 * The shallowest a band is drawn at, and the line below which a stored height is not believed.
 *
 * A region is created the way every node is, with the size its type is given - and that size is the one
 * a region standing on its own opens at, not the depth of a band. What is stored for a region that has
 * only ever been added to a state is therefore a number nobody chose; anything under this is read as
 * exactly that and the default is used instead. It is also the floor a band can be dragged to, which is
 * what makes the two the same number: nothing below it can have come from a drag.
 */
export const MIN_REGION_BAND_HEIGHT = 48;

/**
 * The one depth every band of a state is drawn at: what the state holds in `regionHeight`, or the
 * default where it holds nothing usable.
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
    /**
     * How deep every band of this state is drawn - one height for all of them, taken from the state's
     * own `regionHeight` (see `regionBandHeight`). Not this band's own: the regions of a
     * state are equals, and one drawn deeper than the one beside it reads as the more important of the
     * two, which is a thing UML's notation does not say.
     */
    height: number;
}

export function GStateRegionCompartment(props: GStateRegionCompartmentProps): GModelElement {
    const { node, divided, width } = props;
    const height = Math.max(props.height, MIN_REGION_BAND_HEIGHT);

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
                // Every band opens at the same depth, and the room a state has over and above them is
                // shared out equally between them by `vGrab` - so a state dragged taller grows its bands
                // rather than leaving a gap under them, and they stay the same size as each other
                // however it is dragged.
                vGrab: true,
                prefWidth: Math.max(0, width),
                prefHeight: height
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
