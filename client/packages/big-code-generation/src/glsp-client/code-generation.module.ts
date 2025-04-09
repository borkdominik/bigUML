/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { FeatureModule } from '@eclipse-glsp/client';
import { ExtensionActionKind } from '@eclipse-glsp/vscode-integration-webview/lib/features/default/extension-action-handler.js';
import {
    CodeGenerationActionResponse,
    SelectSourceCodeFolderActionResponse,
    SelectTemplateFileActionResponse
} from '../common/code-generation.action.js';

export const codeGenerationModule = new FeatureModule((bind, _unbind, _isBound, _rebind) => {
    // Allow the CodeGenerationActionResponse to propagate to the server
    bind(ExtensionActionKind).toConstantValue(CodeGenerationActionResponse.KIND);

    // Allow the SelectSourceCodeFolderActionResponse to propagate to the server
    bind(ExtensionActionKind).toConstantValue(SelectSourceCodeFolderActionResponse.KIND);

    // Allow the SelectTemplateFileActionResponse to propagate to the server
    bind(ExtensionActionKind).toConstantValue(SelectTemplateFileActionResponse.KIND);
});
