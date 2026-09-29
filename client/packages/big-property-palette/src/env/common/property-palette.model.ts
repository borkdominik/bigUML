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
    /** Values offered while the field is edited - it still takes any text. */
    suggestions?: string[];
    /** What the value has to be, where it is more than text - see {@link TextFormat}. */
    format?: TextFormat;
}

/**
 * A text value the palette holds to a shape while it is typed: `multiplicity` for a property the
 * definition marks `@Language.multiplicity`.
 */
export type TextFormat = 'multiplicity';

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
    /**
     * Whether each reference offers a way through to its own property palette. Off for a list whose
     * entries are the same kind of thing as the element already open - the messages on a link, say,
     * where following one only arrives at the same list again.
     */
    isNavigable: boolean;
}

export namespace ElementReferenceProperty {
    export const TYPE = 'REFERENCE';

    export interface Reference {
        elementId: string;
        label: string;
        name?: string;
        hint?: string;
        /**
         * The properties of the referenced element edited right in its row, one text field each - a
         * property's name and type, say. Where it is left out the row edits `name` alone. Which fields a
         * type offers is declared on its definition (see `PropertyPalette.inlineFields`).
         */
        fields?: Field[];
        deleteActions: Action[];
    }

    export interface Field {
        propertyId: string;
        label: string;
        value: string;
        /** Values offered while the field is edited - it still takes any text. */
        suggestions?: string[];
        /** What the value has to be, where it is more than text - see {@link TextFormat}. */
        format?: TextFormat;
    }

    export interface CreateReference {
        label: string;
        action: Action;
    }

    export function is(value: ElementProperty): value is ElementReferenceProperty {
        return value.type === TYPE;
    }
}
