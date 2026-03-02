/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { advancedSearchModule } from '@borkdominik-biguml/big-advancedsearch/vscode';
import { helloWorldModule } from '@borkdominik-biguml/big-hello-world/vscode';
import { revisionManagementModule } from '@borkdominik-biguml/big-revision-management/vscode'
import { minimapModule } from '@borkdominik-biguml/big-minimap/vscode';
import { outlineModule } from '@borkdominik-biguml/big-outline/vscode';
import { propertyPaletteModule } from '@borkdominik-biguml/big-property-palette/vscode';
import { createVSCodeCommonContainer, TYPES, type GLSPDiagramSettings, type GLSPServerConfig } from '@borkdominik-biguml/big-vscode/vscode';
import { editorModule, themeModule } from '@borkdominik-biguml/uml-glsp-client/vscode';
import { type Container } from 'inversify';
import type * as vscode from 'vscode';
import { DefaultCommandsProvider } from './features/command/default-commands.js';
import { vscodeModule } from './features/vscode.module.js';
import { VSCodeSettings } from './language.js';

export function createContainer(
    extensionContext: vscode.ExtensionContext,
    options: {
        diagram: GLSPDiagramSettings;
        glspServerConfig: GLSPServerConfig;
    }
): Container {
    const container = createVSCodeCommonContainer(extensionContext, options);

    container.bind(DefaultCommandsProvider).toSelf().inSingletonScope();
    container.bind(TYPES.RootInitialization).toService(DefaultCommandsProvider);

    container.load(
        vscodeModule,
        editorModule({
            diagramType: VSCodeSettings.diagramType,
            viewType: VSCodeSettings.editor.viewType
        }),
        outlineModule(VSCodeSettings.outline.viewId),
        propertyPaletteModule(VSCodeSettings.propertyPalette.viewId),
        minimapModule(VSCodeSettings.minimap.viewId),
        helloWorldModule(VSCodeSettings.helloWorld.viewId),
        advancedSearchModule(VSCodeSettings.advancedSearch.viewId),
        revisionManagementModule(VSCodeSettings.revisionManagement.viewId),
        themeModule
    );

    return container;
}
