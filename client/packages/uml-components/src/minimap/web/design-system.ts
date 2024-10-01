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
import { defineMinimap } from '../minimap.component';
import { defineMinimapWebview } from './minimap-webview.component';

export function useMinimapWebviewDesignSystem(): void {
    useToolkit();
    defineTooltip();
    defineMenu();
    defineContextMenu();
    defineMinimap();
    defineMinimapWebview();
}
