/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { Action } from '@eclipse-glsp/protocol';

import { ElementPropertyItem } from '../property-palette.model';

export interface ElementReferencePropertyItem extends ElementPropertyItem {
    type: typeof ElementReferencePropertyItem.TYPE;
    label: string;
    references: ElementReferencePropertyItem.Reference[];
    creates: ElementReferencePropertyItem.CreateReference[];
    isOrderable: boolean;
}

export namespace ElementReferencePropertyItem {
    export const TYPE = 'REFERENCE';

    export interface Reference {
        label: string;
        elementId: string;
        isReadonly: boolean;
    }

    export interface CreateReference {
        label: string;
        action: Action;
    }

    export function is(value: ElementPropertyItem): value is ElementReferencePropertyItem {
        return value.type === TYPE;
    }
}
