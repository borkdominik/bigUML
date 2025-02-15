/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { defineContextMenu } from '../../menu/context-menu.component.js';
import { defineMenu } from '../../menu/menu.component.js';
import { useToolkit } from '../../toolkit';
import { defineTooltip } from '../../tooltip/tooltip.component.js';
import { definePropertyPalette } from '../property-palette.component.js';
import { definePropertyPaletteReference } from '../reference';
import { definePropertyPaletteWebview } from './property-palette-webview.component.js';

export function usePropertyPaletteWebviewDesignSystem(): void {
    useToolkit();
    defineTooltip();
    defineMenu();
    defineContextMenu();
    definePropertyPalette();
    definePropertyPaletteReference();
    definePropertyPaletteWebview();
}
