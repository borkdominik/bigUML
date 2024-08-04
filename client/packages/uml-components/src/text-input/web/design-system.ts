/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { defineContextMenu } from '../../menu/context-menu.component';
import { defineMenu } from '../../menu/menu.component';
import { useToolkit } from '../../toolkit';
import { defineTooltip } from '../../tooltip/tooltip.component';
import { defineTextInputPaletteReference } from '../reference';
import { defineTextInputPalette } from '../text-input-palette.component';
import { defineTextInputPaletteWebview } from './text-input-palette-webview.component';

export function useTextInputPaletteWebviewDesignSystem(): void {
    useToolkit();
    defineTooltip();
    defineMenu();
    defineContextMenu();
    defineTextInputPalette();
    defineTextInputPaletteReference();
    defineTextInputPaletteWebview();
}
