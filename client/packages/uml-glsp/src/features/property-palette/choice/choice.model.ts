/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { ElementPropertyItem } from '../property-palette.model';

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
