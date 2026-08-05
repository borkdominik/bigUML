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
    children?: GlspNode;
}

export function SectionCompartment(props: SectionCompartmentProps): GModelElement {
    return (
        <GCompartmentElement
            id={props.id}
            type={DefaultTypes.COMPARTMENT}
            layout='vbox'
            layoutOptions={{ hAlign: 'left', resizeContainer: true, hGrab: true }}
            args={props.divider ? { divider: true } : undefined}
        >
            {props.children}
        </GCompartmentElement>
    );
}
