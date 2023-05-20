/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { CreatedElementProperty } from '../property-palette.model';
import { ElementTextPropertyItem } from './text.model';

export interface TextPropertyEvents {
    onBlur?: (item: ElementTextPropertyItem, input: HTMLInputElement, event: FocusEvent) => void;
    onEnter?: (item: ElementTextPropertyItem, input: HTMLInputElement, event: KeyboardEvent) => void;
}

export function createTextProperty(propertyItem: ElementTextPropertyItem, events: TextPropertyEvents): CreatedElementProperty {
    const div = document.createElement('div');
    div.classList.add('property-item', 'property-text-item');

    const label = document.createElement('label');
    label.classList.add('property-item-label');
    label.textContent = propertyItem.label;
    div.appendChild(label);

    const input = document.createElement('input');
    input.classList.add('property-item-full');
    input.type = 'text';
    input.value = propertyItem.text ?? '';
    input.addEventListener('blur', ev => {
        events.onBlur?.(propertyItem, input, ev);
    });
    input.addEventListener('keypress', ev => {
        if (ev.key === 'Enter') {
            ev.stopPropagation();
            events.onEnter?.(propertyItem, input, ev);
        }
    });
    div.appendChild(input);

    return {
        element: div,
        ui: {
            disable: () => {
                input.disabled = true;
            },
            enable: () => {
                input.disabled = false;
            }
        }
    };
}
