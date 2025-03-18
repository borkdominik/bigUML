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
import { SetPropertyPaletteAction } from '../common/index.js';

export const propertyPaletteModule = new FeatureModule((bind, _unbind, _isBound, _rebind) => {
    bind(ExtensionActionKind).toConstantValue(SetPropertyPaletteAction.KIND);
});
