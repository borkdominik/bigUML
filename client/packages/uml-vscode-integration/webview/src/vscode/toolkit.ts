/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

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
    provideVSCodeDesignSystem,
    TextArea,
    TextField,
    vsCodeButton,
    vsCodeCheckbox,
    vsCodeDataGrid,
    vsCodeDataGridCell,
    vsCodeDataGridRow,
    vsCodeDivider,
    vsCodeDropdown,
    vsCodeOption,
    vsCodePanels,
    vsCodePanelTab,
    vsCodePanelView,
    vsCodeTextArea,
    vsCodeTextField
} from '@vscode/webview-ui-toolkit';

declare global {
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
    }
}

export function initializeToolkit(): void {
    provideVSCodeDesignSystem().register(
        vsCodeButton(),
        vsCodeDropdown(),
        vsCodeCheckbox(),
        vsCodeDataGrid(),
        vsCodeDataGridCell(),
        vsCodeDataGridRow(),
        vsCodeDivider(),
        vsCodeOption(),
        vsCodePanels(),
        vsCodePanelTab(),
        vsCodePanelView(),
        vsCodeTextField(),
        vsCodeTextArea()
    );
}
