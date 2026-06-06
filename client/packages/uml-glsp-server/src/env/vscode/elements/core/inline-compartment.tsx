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

export interface InlineCompartmentProps {
    id: string;
    type?: string;
    layoutOptions?: Record<string, any>;
    children?: GlspNode;
}

const defaultInlineOptions = {
    hGap: 3,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    resizeContainer: true
};

export function InlineCompartment(props: InlineCompartmentProps): GModelElement {
    return (
        <GCompartmentElement
            id={props.id}
            type={props.type ?? DefaultTypes.COMPARTMENT}
            layout='hbox'
            layoutOptions={props.layoutOptions ?? defaultInlineOptions}
        >
            {props.children}
        </GCompartmentElement>
    );
}
