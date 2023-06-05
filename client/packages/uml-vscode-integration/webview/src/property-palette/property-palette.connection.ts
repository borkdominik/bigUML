/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { initializeVSCode } from '../vscode';

export function initializeConnection(): void {
    initializeVSCode();

    window.addEventListener('message', event => {
        console.log('IFRAME GOT', event.data);

        const propertyPalette = document.getElementsByTagName('biguml-property-palette')[0];

        if (propertyPalette !== undefined) {
            propertyPalette.palette = event.data;
        }
    });
}
