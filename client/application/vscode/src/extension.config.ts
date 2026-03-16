/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { advancedSearchModule } from '@borkdominik-biguml/big-advancedsearch/vscode';
import { codeGenerationModule } from '@borkdominik-biguml/big-code-generation/vscode';
import { minimapModule } from '@borkdominik-biguml/big-minimap/vscode';
import { outlineModule } from '@borkdominik-biguml/big-outline/vscode';
import { propertyPaletteModule } from '@borkdominik-biguml/big-property-palette/vscode';
import { VSCodeSettings } from '@borkdominik-biguml/big-vscode';
import { vscodeModule, type GlspDiagramSettings, type GlspServerConfig } from '@borkdominik-biguml/big-vscode/vscode';
import { editorModule, themeModule } from '@borkdominik-biguml/uml-glsp-client/vscode';
import { type Container } from 'inversify';
import type * as vscode from 'vscode';

export function createContainer(
    extensionContext: vscode.ExtensionContext,
    options: {
        diagram: GlspDiagramSettings;
        glspServerConfig: GlspServerConfig;
    }
): Container {
    const container = vscodeModule(extensionContext, options);

    container.load(
        editorModule({
            diagramType: VSCodeSettings.diagramType,
            viewType: VSCodeSettings.editor.viewType
        }),
        outlineModule(VSCodeSettings.outline.viewType),
        propertyPaletteModule(VSCodeSettings.propertyPalette.viewType),
        minimapModule(VSCodeSettings.minimap.viewType),
        advancedSearchModule(VSCodeSettings.advancedSearch.viewType),
        codeGenerationModule(VSCodeSettings.codeGeneration.viewType),
        // {
        //   "id": "bigUML.panel.revision-management",
        //   "name": "Timeline",
        //   "type": "webview",
        //   "when": "bigUML.isRunning"
        // },
        // "bigUML.timeline.onSave": {
        //   "type": "boolean",
        //   "default": true,
        //   "description": "Create a new timeline entry on file save."
        // },
        // "bigUML.timeline.persistent": {
        //   "type": "boolean",
        //   "default": true,
        //   "description": "Persist timeline entries across restarts."
        // }
        // revisionManagementModule(VSCodeSettings.revisionManagement.viewType),
        themeModule
    );

    return container;
}
