/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { FeatureModule } from '@eclipse-glsp/client';
import { ExtensionActionKind } from '@eclipse-glsp/vscode-integration-webview/lib/features/default/extension-action-handler.js';
import {
    AvailableExportTemplatesResponse,
    ExportInstancesResponse,
    GeneratableClassifiersResponse,
    GenerateInstancesPreviewResponse,
    InstanceExplorerDataResponse,
    SaveExportedInstancesResponse
} from '../common/index.js';

export const instanceExplorerModule = new FeatureModule(bind => {
    bind(ExtensionActionKind).toConstantValue(InstanceExplorerDataResponse.KIND);
    bind(ExtensionActionKind).toConstantValue(AvailableExportTemplatesResponse.KIND);
    bind(ExtensionActionKind).toConstantValue(ExportInstancesResponse.KIND);
    bind(ExtensionActionKind).toConstantValue(SaveExportedInstancesResponse.KIND);
    bind(ExtensionActionKind).toConstantValue(GenerateInstancesPreviewResponse.KIND);
    bind(ExtensionActionKind).toConstantValue(GeneratableClassifiersResponse.KIND);
});
