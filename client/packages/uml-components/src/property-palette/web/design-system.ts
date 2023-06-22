/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { defineContextMenu } from '../../menu/vscode-context-menu.component';
import { defineMenu } from '../../menu/vscode-menu.component';
import { useToolkit } from '../../toolkit';
import { definePropertyPalette } from '../property-palette.component';
import { definePropertyPaletteReference } from '../reference';
import { definePropertyPaletteWebview } from './property-palette-webview.component';

export function usePropertyPaletteWebviewDesignSystem(): void {
    useToolkit();
    defineMenu();
    defineContextMenu();
    definePropertyPalette();
    definePropertyPaletteReference();
    definePropertyPaletteWebview();
}
