/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { Action, hasStringProp, RequestAction, ResponseAction } from '@eclipse-glsp/protocol';

export interface ElementProperties {
    elementId: string;
    label?: string;
    items: ElementProperty[];
}

export interface ElementProperty {
    elementId: string;
    propertyId: string;
    type: 'TEXT' | 'BOOL' | 'CHOICE' | 'REFERENCE';
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
}

export namespace ElementReferenceProperty {
    export const TYPE = 'REFERENCE';

    export interface Reference {
        elementId: string;
        label: string;
        name?: string;
        isReadonly: boolean;
    }

    export interface CreateReference {
        label: string;
        action: Action;
    }

    export function is(value: ElementProperty): value is ElementReferenceProperty {
        return value.type === TYPE;
    }
}

export interface RequestPropertyPaletteAction extends RequestAction<SetPropertyPaletteAction> {
    kind: typeof RequestPropertyPaletteAction.KIND;
    elementId: string;
}

export namespace RequestPropertyPaletteAction {
    export const KIND = 'requestPropertyPalette';

    export function is(object: any): object is RequestPropertyPaletteAction {
        return Action.hasKind(object, KIND) && hasStringProp(object, 'elementId');
    }

    export function create(options: { elementId: string; requestId?: string }): RequestPropertyPaletteAction {
        return {
            kind: KIND,
            requestId: '',
            ...options
        };
    }
}

export interface SetPropertyPaletteAction extends ResponseAction {
    kind: typeof SetPropertyPaletteAction.KIND;
    elementId: string;
    palette?: ElementProperties;
}

export namespace SetPropertyPaletteAction {
    export const KIND = 'setPropertyPalette';

    export function is(object: any): object is SetPropertyPaletteAction {
        return Action.hasKind(object, KIND);
    }

    export function create(options: { elementId: string; palette?: ElementProperties; responseId?: string }): SetPropertyPaletteAction {
        return {
            kind: KIND,
            responseId: '',
            ...options
        };
    }
}

export interface UpdateElementPropertyAction extends Action {
    kind: typeof UpdateElementPropertyAction.KIND;
    elementId: string;
    propertyId: string;
    value: string;
}

export namespace UpdateElementPropertyAction {
    export const KIND = 'updateElementProperty';

    export function is(object: any): object is UpdateElementPropertyAction {
        return (
            RequestAction.hasKind(object, KIND) &&
            hasStringProp(object, 'elementId') &&
            hasStringProp(object, 'propertyId') &&
            hasStringProp(object, 'value')
        );
    }

    export function create(options: { elementId: string; propertyId: string; value: string }): UpdateElementPropertyAction {
        return {
            kind: KIND,
            ...options
        };
    }
}
