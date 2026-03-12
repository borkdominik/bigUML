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
import { GenerateDiagramResponseAction, SelectedFolderResponseAction } from '../common/code-to-class-diagram.action.js';

export const codeToClassDiagramModule = new FeatureModule((bind) => {
    //const context = { bind, unbind, isBound, rebind };
    // Register the CodeToClassDiagramHandler to handle the RequestCodeToClassDiagramAction
    // bind(CodeToClassDiagramHandler).toSelf().inSingletonScope();
    //configureActionHandler(context, GenerateDiagramRequestAction.KIND, CodeToClassDiagramHandler);

    // Allow the SelectedFolderResponseAction to propagate to the server
    // Added:
    bind(ExtensionActionKind).toConstantValue(SelectedFolderResponseAction.KIND);
    // bind(ExtensionActionKind).toConstantValue(InitClientHandshakeResponse.KIND);

    bind(ExtensionActionKind).toConstantValue(GenerateDiagramResponseAction.KIND);

});
