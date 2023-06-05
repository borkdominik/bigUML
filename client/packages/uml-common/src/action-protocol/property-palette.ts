/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { Action, RequestAction, ResponseAction, hasObjectProp, hasStringProp } from '@eclipse-glsp/protocol';

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

export interface CreatedElementProperty {
    element: HTMLElement;
    ui: ElementPropertyUI;
}

export interface ElementPropertyUI {
    enable: () => void;
    disable: () => void;
}

export interface RequestPropertyPaletteAction extends RequestAction<SetPropertyPaletteAction> {
    kind: typeof RequestPropertyPaletteAction.KIND;
    elementId: string;
}

export namespace RequestPropertyPaletteAction {
    export const KIND = 'requestPropertyPalette';

    export function is(object: any): object is RequestPropertyPaletteAction {
        return RequestAction.hasKind(object, KIND) && hasStringProp(object, 'elementId');
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
        return RequestAction.hasKind(object, KIND) && hasStringProp(object, 'elementId') && hasObjectProp(object, 'palette');
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
