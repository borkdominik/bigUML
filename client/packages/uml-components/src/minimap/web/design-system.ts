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
import { defineMinimap } from '../minimap.component.js';
import { defineMinimapWebview } from './minimap-webview.component.js';

export function useMinimapWebviewDesignSystem(): void {
    useToolkit();
    defineTooltip();
    defineMenu();
    defineContextMenu();
    defineMinimap();
    defineMinimapWebview();
}
