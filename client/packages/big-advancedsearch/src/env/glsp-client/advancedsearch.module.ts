/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { FeatureModule, FitToScreenAction, SelectAction, SelectAllAction } from '@eclipse-glsp/client';
import { ExtensionActionKind } from '@eclipse-glsp/vscode-integration-webview/lib/features/default/extension-action-handler.js';
import { AdvancedSearchActionResponse } from '../common/advancedsearch.action.js';
import { HighlightElementActionResponse } from '../common/highlight.action.js';
import { ReplaceActionResponse } from '../common/replace.action.js';

export const advancedSearchModule = new FeatureModule(bind => {
    // Allow responses to propagate from server back to extension
    bind(ExtensionActionKind).toConstantValue(AdvancedSearchActionResponse.KIND);
    bind(ExtensionActionKind).toConstantValue(HighlightElementActionResponse.KIND);
    bind(ExtensionActionKind).toConstantValue(ReplaceActionResponse.KIND);

    // Allow diagram actions dispatched by the server to reach the GLSP client/diagram
    bind(ExtensionActionKind).toConstantValue(SelectAction.KIND);
    bind(ExtensionActionKind).toConstantValue(SelectAllAction.KIND);
    bind(ExtensionActionKind).toConstantValue(FitToScreenAction.KIND);
});
