/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
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
