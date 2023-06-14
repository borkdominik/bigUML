/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { SetPropertyPaletteAction } from '@borkdominik-biguml/uml-common';
import {} from 'vscode';
import { DATA_CONTEXT_MENU } from '../vscode/constants';
import { initializeToolkit } from '../vscode/toolkit';

import '../../css/reset.css';

export function initializeConnection(): void {
    initializeToolkit();

    const propertyPalette = document.getElementsByTagName('biguml-property-palette')[0];

    if (!propertyPalette) {
        throw new Error('Property Palette not found');
    }

    document.addEventListener('contextmenu', event => {
        const path = event.composedPath();

        if (path.some(p => p instanceof HTMLElement && p.hasAttribute(DATA_CONTEXT_MENU))) {
            const shadowTarget = path[0];
            Object.defineProperty(event, 'target', { writable: false, value: shadowTarget });
        } else {
            event.stopImmediatePropagation();
        }
    });

    window.addEventListener('message', event => {
        if (SetPropertyPaletteAction.is(event.data)) {
            if (propertyPalette !== undefined) {
                propertyPalette.palette = event.data.palette;
            }
        } else {
            console.warn('Unknown message', event);
        }
    });
}
