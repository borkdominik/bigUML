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
import { MIN_REGION_BAND_HEIGHT } from '../geometry/composite-state.js';
import { FreeformCompartment } from './core/index.js';

/**
 * One region of a composite state: the band inside the state box that its substates are drawn on.
 *
 * A band rather than a shape of its own, the way a swimlane holds its lanes (see
 * `GActivityPartitionNodeElement`). The state lays the bands out and draws the rules between them, so a
 * region cannot be dragged out of the state that owns it, left behind when it moves, or resized away
 * from its neighbour. What stands on a band - the region's substates - is drawn inside it, the way a
 * package draws its classes, so it moves with the state and the band grows to keep it in.
 *
 * The band carries the region's own id, so clicking it selects the region, the keyboard deletes it, and
 * the state's property panel can navigate into it - all of which go by the id of an element the index
 * knows.
 */

/** Inset of the region's name from the band's corner. */
const BAND_PADDING = 4;

export interface GStateRegionCompartmentProps {
    node: Region;
    /** Whether a rule is drawn above this band, i.e. every band but the first. */
    divided: boolean;
    /** The width the band opens at, which is the room the state has inside its own borders. */
    width: number;
    /** The substates the region holds, drawn on the band. */
    substates?: GModelElement[];
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
                // rather than a minimum, because a band without substates holds nothing the layouter can
                // measure, and a compartment with no content of its own is never given bounds at all, which
                // collapsed the band and everything below it.
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
            {props.substates && <FreeformCompartment ownerId={node.__id}>{props.substates}</FreeformCompartment>}
        </GCompartmentElement>
    );
}
