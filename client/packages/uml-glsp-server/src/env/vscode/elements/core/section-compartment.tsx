/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import type { GlspNode } from '@borkdominik-biguml/uml-glsp-server/jsx';
import { GCompartmentElement } from '@borkdominik-biguml/uml-glsp-server/jsx';
import { DefaultTypes } from '@eclipse-glsp/protocol';
import type { GModelElement } from '@eclipse-glsp/server';

export interface SectionCompartmentProps {
    id: string;
    divider?: boolean;
    /** A type of its own, for a section the user does something to - see `CommonModelTypes.COMP_STATE_PARTS`. */
    type?: string;
    /**
     * The height the section is drawn at, where the user has given it one. Left out, the section is as
     * tall as what is written in it, which is what every section but one is.
     */
    height?: number;
    children?: GlspNode;
}

export function SectionCompartment(props: SectionCompartmentProps): GModelElement {
    return (
        <GCompartmentElement
            id={props.id}
            type={props.type ?? DefaultTypes.COMPARTMENT}
            layout='vbox'
            layoutOptions={{
                hAlign: 'left',
                resizeContainer: true,
                hGrab: true,
                // A given height is `prefHeight` rather than a minimum: it is what the section is drawn at,
                // and unlike a minimum it is not read as a limit, so it can still be dragged back down to
                // the lines it holds.
                ...(props.height && props.height > 0 ? { prefHeight: props.height } : {})
            }}
            args={props.divider ? { divider: true } : undefined}
        >
            {props.children}
        </GCompartmentElement>
    );
}
