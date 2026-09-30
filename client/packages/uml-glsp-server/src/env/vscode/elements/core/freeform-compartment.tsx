/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
/** @jsxImportSource @borkdominik-biguml/uml-glsp-server/jsx */

import { GCompartmentElement } from '@borkdominik-biguml/uml-glsp-server/jsx';
import { DefaultTypes } from '@eclipse-glsp/protocol';
import type { GModelElement } from '@eclipse-glsp/server';

/** The id of the compartment an element draws what it holds in - see {@link FreeformCompartment}. */
export function freeformCompartmentId(ownerId: string): string {
    return ownerId + '_freeform';
}

export interface FreeformCompartmentProps {
    /** The id of the element whose contents these are. */
    ownerId: string;
    /** Whether a rule is drawn above the compartment, between it and the container's name. */
    divider?: boolean;
    children: GModelElement[];
}

/**
 * What a node is laid out with where it sets nothing of its own: the defaults of GLSP's `vbox` and `hbox`
 * layouters, for every option a container here sets. Handed to the nodes in the compartment in place of
 * whatever the container they stand in set for itself - its alignment, its padding, its gaps, its floor.
 *
 * The compartment itself places its nodes where they are stored and pads nothing, so the only thing these
 * change about it is a few pixels of room around its contents.
 */
const NODE_LAYOUT_DEFAULTS = {
    resizeContainer: true,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    paddingRight: 5,
    paddingFactor: 1,
    vGap: 1,
    hGap: 1,
    hAlign: 'center',
    vAlign: 'center',
    minWidth: 0,
    minHeight: 0
} as const;

/**
 * The compartment a container draws the nodes it holds in, each at its own position - the way a package
 * draws its classes, a subject its use cases, a region its states. Being drawn inside the container,
 * they move with it, and it grows to keep them in.
 *
 * The container's own layout is reset for what is drawn in here (see {@link NODE_LAYOUT_DEFAULTS}): the
 * client merges the layout options of every ancestor into a node's own, so without it a node in a frame
 * with a floor would open at that floor, a class in a package would be padded down by the package's tab,
 * and a node in a lane would write its name along the left the way the lane lays out its own contents.
 *
 * The compartment takes the width of its container by grabbing it rather than by being aligned in it:
 * alignment is one of the options handed on, and grabbing is one the layouter never hands on.
 */
export function FreeformCompartment(props: FreeformCompartmentProps): GModelElement {
    return (
        <GCompartmentElement
            id={freeformCompartmentId(props.ownerId)}
            type={DefaultTypes.COMPARTMENT}
            layout='freeform'
            args={{ 'children-container': true, ...(props.divider ? { divider: true } : {}) }}
            layoutOptions={{ ...NODE_LAYOUT_DEFAULTS, hGrab: true }}
        >
            {props.children}
        </GCompartmentElement>
    );
}
