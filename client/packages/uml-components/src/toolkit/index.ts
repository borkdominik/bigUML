/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { provideFASTDesignSystem } from '@microsoft/fast-components';
import {
    provideVSCodeDesignSystem,
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
import { bigCombobox } from './combobox/combobox.component.js';

export function useToolkit(): void {
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

    provideFASTDesignSystem().withPrefix('vscode').register(bigCombobox());
}
