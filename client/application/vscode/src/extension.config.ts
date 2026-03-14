/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { advancedSearchModule } from '@borkdominik-biguml/big-advancedsearch/vscode';
import { minimapModule } from '@borkdominik-biguml/big-minimap/vscode';
import { outlineModule } from '@borkdominik-biguml/big-outline/vscode';
import { propertyPaletteModule } from '@borkdominik-biguml/big-property-palette/vscode';
import { VSCodeSettings } from '@borkdominik-biguml/big-vscode';
import { vscodeModule, type GLSPDiagramSettings, type GLSPServerConfig } from '@borkdominik-biguml/big-vscode/vscode';
import { editorModule, themeModule } from '@borkdominik-biguml/uml-glsp-client/vscode';
import { type Container } from 'inversify';
import type * as vscode from 'vscode';

export function createContainer(
    extensionContext: vscode.ExtensionContext,
    options: {
        diagram: GLSPDiagramSettings;
        glspServerConfig: GLSPServerConfig;
    }
): Container {
    const container = vscodeModule(extensionContext, options);

    container.load(
        editorModule({
            diagramType: VSCodeSettings.diagramType,
            viewType: VSCodeSettings.editor.viewType
        }),
        outlineModule(VSCodeSettings.outline.viewId),
        propertyPaletteModule(VSCodeSettings.propertyPalette.viewId),
        minimapModule(VSCodeSettings.minimap.viewId),
        advancedSearchModule(VSCodeSettings.advancedSearch.viewId),
        // {
        //   "id": "bigUML.panel.revision-management",
        //   "name": "Timeline",
        //   "type": "webview",
        //   "when": "bigUML.isRunning"
        // },
        // revisionManagementModule(VSCodeSettings.revisionManagement.viewId),
        themeModule
    );

    return container;
}
