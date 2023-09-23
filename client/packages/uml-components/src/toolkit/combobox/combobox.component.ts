/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { Combobox, comboboxTemplate } from '@microsoft/fast-foundation';
import { bigComboxboxStyles } from './combobox.style';

export const bigCombobox = Combobox.compose({
    baseName: 'combobox',
    template: comboboxTemplate,
    styles: bigComboxboxStyles as any,
    shadowOptions: {
        delegatesFocus: true
    },
    indicator: `
    <svg 
        class="select-indicator"
        part="select-indicator"
        width="16" 
        height="16" 
        viewBox="0 0 16 16" 
        xmlns="http://www.w3.org/2000/svg" 
        fill="currentColor"
    >
        <path 
            fill-rule="evenodd" 
            clip-rule="evenodd" 
            d="M7.976 10.072l4.357-4.357.62.618L8.284 11h-.618L3 6.333l.619-.618 4.357 4.357z"
        />
    </svg>
`
});
