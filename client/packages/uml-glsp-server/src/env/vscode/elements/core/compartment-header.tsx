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
import { DefaultTypes } from '@eclipse-glsp/protocol';
import type { GModelElement } from '@eclipse-glsp/server';

export interface CompartmentHeaderProps {
    id: string;
    name: string;
    stereotype?: string;
    stereotypeCssClasses?: string[];
    isAbstract?: boolean;
}

export function CompartmentHeader(props: CompartmentHeaderProps): GModelElement {
    const { id, name, stereotype, stereotypeCssClasses, isAbstract } = props;

    const nameLabelCssClasses = ['uml-font-bold'];
    if (isAbstract) {
        nameLabelCssClasses.push('uml-font-italic');
    }

    return (
        <GCompartmentElement
            id={id + '_comp_header'}
            type={DefaultTypes.COMPARTMENT_HEADER}
            layout='vbox'
            layoutOptions={{ hAlign: 'center' }}
        >
            {isAbstract && !stereotype && <GLabelElement type={CommonModelTypes.LABEL_TEXT} text='<<abstract>>' />}
            {stereotype && (
                <GLabelElement
                    id={id + '_annotation_label'}
                    type={CommonModelTypes.LABEL_TEXT}
                    text={`<<${stereotype}>>`}
                    cssClasses={stereotypeCssClasses}
                />
            )}
            <GLabelElement
                id={id + '_name_label'}
                type={CommonModelTypes.LABEL_NAME}
                text={name}
                args={{ highlight: true }}
                cssClasses={nameLabelCssClasses}
            />
        </GCompartmentElement>
    );
}
