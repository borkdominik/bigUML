/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { Combobox } from '@microsoft/fast-components';
import {
    Button,
    Checkbox,
    DataGrid,
    DataGridCell,
    DataGridRow,
    Divider,
    Dropdown,
    Option,
    Panels,
    PanelTab,
    PanelView,
    TextArea,
    TextField
} from '@vscode/webview-ui-toolkit';
import { VsCodeApi } from 'vscode-messenger-webview';
import { ContextMenu, ContextMenuItem } from './menu/context-menu.component';
import { Menu, MenuItem } from './menu/menu.component';
import { Minimap, MinimapWebview } from './minimap';
import { PropertyPalette, PropertyPaletteWebview } from './property-palette';
import { PropertyPaletteReference } from './property-palette/reference/property-palette-reference.component';
import { TextInputPalette,TextInputPaletteWebview } from './text-input';
import { Tooltip } from './tooltip/tooltip.component';

declare global {
    function acquireVsCodeApi(): VsCodeApi;

    interface HTMLElementTagNameMap {
        'vscode-button': Button;
        'vscode-dropdown': Dropdown;
        'vscode-checkbox': Checkbox;
        'vscode-data-grid': DataGrid;
        'vscode-data-grid-cell': DataGridCell;
        'vscode-data-grid-row': DataGridRow;
        'vscode-divider': Divider;
        'vscode-option': Option;
        'vscode-panels': Panels;
        'vscode-panel-tab': PanelTab;
        'vscode-panel-view': PanelView;
        'vscode-text-field': TextField;
        'vscode-text-area': TextArea;
        'vscode-combobox': Combobox;
        'big-context-menu': ContextMenu;
        'big-context-menu-item': ContextMenuItem;
        'big-property-palette': PropertyPalette;
        'big-property-palette-reference': PropertyPaletteReference;
        'big-property-palette-webview': PropertyPaletteWebview;
        'big-minimap': Minimap;
        'big-minimap-webview': MinimapWebview;
        'big-text-input-palette': TextInputPalette;
        'big-text-input-palette-webview': TextInputPaletteWebview;
        'big-menu': Menu;
        'big-menu-item': MenuItem;
        'big-tooltip': Tooltip;
    }
}
