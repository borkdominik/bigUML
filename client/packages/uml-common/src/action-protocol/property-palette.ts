/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { Action, hasStringProp, RequestAction, ResponseAction } from '@eclipse-glsp/protocol';

export interface PropertyPalette {
    elementId: string;
    label?: string;
    items: ElementPropertyItem[];
}

export interface ElementPropertyItem {
    elementId: string;
    propertyId: string;
    type: 'TEXT' | 'BOOL' | 'CHOICE' | 'REFERENCE';
}

export interface ElementTextPropertyItem extends ElementPropertyItem {
    type: typeof ElementTextPropertyItem.TYPE;
    text: string;
    label: string;
}

export namespace ElementTextPropertyItem {
    export const TYPE = 'TEXT';

    export function is(value: ElementPropertyItem): value is ElementTextPropertyItem {
        return value.type === TYPE;
    }
}

export interface ElementBoolPropertyItem extends ElementPropertyItem {
    type: typeof ElementBoolPropertyItem.TYPE;
    value: boolean;
    label: string;
}

export namespace ElementBoolPropertyItem {
    export const TYPE = 'BOOL';

    export function is(value: ElementPropertyItem): value is ElementBoolPropertyItem {
        return value.type === TYPE;
    }
}

export interface ElementChoicePropertyItem extends ElementPropertyItem {
    type: typeof ElementChoicePropertyItem.TYPE;
    choices: {
        label: string;
        value: string;
    }[];
    choice: string;
    label: string;
}

export namespace ElementChoicePropertyItem {
    export const TYPE = 'CHOICE';

    export function is(value: ElementPropertyItem): value is ElementChoicePropertyItem {
        return value.type === TYPE;
    }
}

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
    palette?: PropertyPalette;
}

export namespace SetPropertyPaletteAction {
    export const KIND = 'setPropertyPalette';

    export function is(object: any): object is SetPropertyPaletteAction {
        return Action.hasKind(object, KIND);
    }

    export function create(options: { elementId: string; palette?: PropertyPalette; responseId?: string }): SetPropertyPaletteAction {
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
