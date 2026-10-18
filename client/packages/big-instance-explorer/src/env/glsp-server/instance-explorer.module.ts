/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { DiagramFeatureModule } from '@borkdominik-biguml/uml-glsp-server/vscode';
import type { ActionHandlerConstructor, InstanceMultiBinding, OperationHandlerConstructor } from '@eclipse-glsp/server';
import {
    CreateClassifierInstanceOperationHandler,
    CreateInstanceLinkOperationHandler,
    RequestInstanceExplorerDataActionHandler,
    UpdateInstanceLinkEndOperationHandler,
    UpdateInstanceSlotValuesOperationHandler
} from './instance-explorer.handler.js';
import { ExportInstancesActionHandler } from './export.handler.js';
import {
    GeneratableClassifiersActionHandler,
    GenerateInstancesOperationHandler,
    GenerateInstancesPreviewActionHandler
} from './generate.handler.js';

class InstanceExplorerDiagramFeatureModule extends DiagramFeatureModule {
    override configureActionHandlers(binding: InstanceMultiBinding<ActionHandlerConstructor>): void {
        binding.add(RequestInstanceExplorerDataActionHandler);
        binding.add(ExportInstancesActionHandler);
        binding.add(GenerateInstancesPreviewActionHandler);
        binding.add(GeneratableClassifiersActionHandler);
    }

    override configureOperationHandlers(binding: InstanceMultiBinding<OperationHandlerConstructor>): void {
        binding.add(CreateClassifierInstanceOperationHandler);
        binding.add(UpdateInstanceSlotValuesOperationHandler);
        binding.add(UpdateInstanceLinkEndOperationHandler);
        binding.add(CreateInstanceLinkOperationHandler);
        binding.add(GenerateInstancesOperationHandler);
    }
}

export const instanceExplorerGlspModule = new InstanceExplorerDiagramFeatureModule();
