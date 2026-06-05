/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { CommonModelTypes } from '@borkdominik-biguml/uml-glsp-server';
import { GLabelElement } from '@borkdominik-biguml/uml-glsp-server/jsx';
import type { GModelElement } from '@eclipse-glsp/server';

export function getVisibilitySymbol(visibility: string): string {
    switch (visibility) {
        case 'PUBLIC':
            return '+';
        case 'PRIVATE':
            return '-';
        case 'PROTECTED':
            return '#';
        case 'PACKAGE':
            return '~';
        default:
            return '';
    }
}

export interface VisibilityLabelProps {
    id?: string;
    visibility: string;
}

export function VisibilityLabel(props: VisibilityLabelProps): GModelElement {
    return <GLabelElement id={props.id} type={CommonModelTypes.LABEL_TEXT} text={getVisibilitySymbol(props.visibility)} />;
}
