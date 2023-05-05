/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { ElementPropertyItem } from '../property-palette.model';

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
