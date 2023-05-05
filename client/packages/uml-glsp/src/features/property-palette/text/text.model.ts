/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { ElementPropertyItem } from '../property-palette.model';

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
