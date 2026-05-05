/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import {
    CodeGenerationActionResponse,
    SelectSourceCodeFolderActionResponse,
    SelectTemplateFileActionResponse
} from '@borkdominik-biguml/big-code-generation';
import { FeatureModule } from '@eclipse-glsp/client';
import { ExtensionActionKind } from '@eclipse-glsp/vscode-integration-webview/lib/features/default/extension-action-handler.js';

export const codeGenerationModule = new FeatureModule((bind, _unbind, _isBound, _rebind) => {
    bind(ExtensionActionKind).toConstantValue(CodeGenerationActionResponse.KIND);
    bind(ExtensionActionKind).toConstantValue(SelectSourceCodeFolderActionResponse.KIND);
    bind(ExtensionActionKind).toConstantValue(SelectTemplateFileActionResponse.KIND);
});
