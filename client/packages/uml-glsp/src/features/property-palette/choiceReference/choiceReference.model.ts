/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
/* import { Action } from '@eclipse-glsp/protocol';

import { ElementPropertyItem } from '../property-palette.model';

export interface ElementReferencePropertyItemNoCreate extends ElementPropertyItem {
    type: typeof ElementReferencePropertyItemNoCreate.TYPE;
    label: string;
    references: ElementReferencePropertyItemNoCreate.Reference[];
    creates: ElementReferencePropertyItemNoCreate.CreateReference[];
    isOrderable: boolean;
}

export namespace ElementReferencePropertyItemNoCreate {
    export const TYPE = 'CHOICEREFERENCE';

    export interface Reference {
        label: string;
        elementId: string;
        isReadonly: boolean;
    }

    export interface CreateReference {
        label: string;
        action: Action;
    }

    export function is(value: ElementPropertyItem): value is ElementReferencePropertyItemNoCreate {
        return value.type === TYPE;
    }
}
*/
