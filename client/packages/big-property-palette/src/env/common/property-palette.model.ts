/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { type Action } from '@eclipse-glsp/protocol';

export interface ElementProperties {
    elementId: string;
    label?: string;
    items: ElementProperty[];
}

export interface ElementProperty {
    elementId: string;
    propertyId: string;
    type: 'TEXT' | 'BOOL' | 'CHOICE' | 'REFERENCE';
    disabled: boolean;
}

export interface ElementTextProperty extends ElementProperty {
    type: typeof ElementTextProperty.TYPE;
    text: string;
    label: string;
}

export namespace ElementTextProperty {
    export const TYPE = 'TEXT';

    export function is(value: ElementProperty): value is ElementTextProperty {
        return value.type === TYPE;
    }
}

export interface ElementBoolProperty extends ElementProperty {
    type: typeof ElementBoolProperty.TYPE;
    value: boolean;
    label: string;
}

export namespace ElementBoolProperty {
    export const TYPE = 'BOOL';

    export function is(value: ElementProperty): value is ElementBoolProperty {
        return value.type === TYPE;
    }
}

export interface ElementChoiceProperty extends ElementProperty {
    type: typeof ElementChoiceProperty.TYPE;
    choices: {
        label: string;
        value: string;
        secondaryText?: string;
    }[];
    choice: string;
    label: string;
}

export namespace ElementChoiceProperty {
    export const TYPE = 'CHOICE';

    export function is(value: ElementProperty): value is ElementChoiceProperty {
        return value.type === TYPE;
    }
}

export interface ElementReferenceProperty extends ElementProperty {
    type: typeof ElementReferenceProperty.TYPE;
    label: string;
    references: ElementReferenceProperty.Reference[];
    creates: ElementReferenceProperty.CreateReference[];
    isOrderable: boolean;
    isAutocomplete: boolean;
}

export namespace ElementReferenceProperty {
    export const TYPE = 'REFERENCE';

    export interface Reference {
        elementId: string;
        label: string;
        name?: string;
        hint?: string;
        deleteActions: Action[];
    }

    export interface CreateReference {
        label: string;
        action: Action;
    }

    export function is(value: ElementProperty): value is ElementReferenceProperty {
        return value.type === TYPE;
    }
}
