/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { configureCommand, FeatureModule, InitializeCanvasBoundsAction, SetViewportAction, TYPES } from '@eclipse-glsp/client';
import { ExtensionActionKind } from '@eclipse-glsp/vscode-integration-webview/lib/features/default/extension-action-handler.js';
import { MinimapExportSvgAction } from '../common/minimap.action.js';
import { MinimapExportSvgCommand, MinimapExportSvgPostprocessor, MinimapGLSPSvgExporter } from './minimap.handler.js';

export const minimapModule = new FeatureModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };
    configureCommand(context, MinimapExportSvgCommand);
    bind(MinimapGLSPSvgExporter).toSelf().inSingletonScope();

    bind(MinimapExportSvgPostprocessor).toSelf().inSingletonScope();
    bind(TYPES.HiddenVNodePostprocessor).toService(MinimapExportSvgPostprocessor);

    bind(ExtensionActionKind).toConstantValue(MinimapExportSvgAction.KIND);
    bind(ExtensionActionKind).toConstantValue(SetViewportAction.KIND); // necessary to have it in the provider loop
    bind(ExtensionActionKind).toConstantValue(InitializeCanvasBoundsAction.KIND); // necessary to have it in the provider loop
});
