/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import {
    ApplyModelPatchResponse,
    ApplyTransformationResponse,
    TransformationPreviewResponse
} from '@borkdominik-biguml/big-object-to-class';
import { FeatureModule } from '@eclipse-glsp/client';
import { ExtensionActionKind } from '@eclipse-glsp/vscode-integration-webview/lib/features/default/extension-action-handler.js';

/**
 * GLSP client module: registers the response action kinds so the webview
 * extension handler can deserialize and forward them to the VSCode host.
 */
export const transformationModule = new FeatureModule((bind, _unbind, _isBound, _rebind) => {
    bind(ExtensionActionKind).toConstantValue(TransformationPreviewResponse.KIND);
    bind(ExtensionActionKind).toConstantValue(ApplyTransformationResponse.KIND);
    bind(ExtensionActionKind).toConstantValue(ApplyModelPatchResponse.KIND);
});
