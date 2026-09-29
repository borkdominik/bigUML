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
    /**
     * Writes a name of several words over several lines, one word per line, instead of on a single
     * line. A shape that does this can be dragged narrower than its name reads on one line, which is
     * why it is asked for per shape rather than done for every name.
     */
    wrapName?: boolean;
}

export function CompartmentHeader(props: CompartmentHeaderProps): GModelElement {
    const { id, name, stereotype, stereotypeCssClasses, isAbstract, wrapName } = props;

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
                args={wrapName ? { highlight: true, wrapAtSpaces: true } : { highlight: true }}
                cssClasses={nameLabelCssClasses}
            />
        </GCompartmentElement>
    );
}
