/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { FeatureDiagramModule } from '@borkdominik-biguml/uml-glsp-server/vscode';
import type { ActionHandlerConstructor, InstanceMultiBinding } from '@eclipse-glsp/server';
import { AdvancedSearchActionHandler } from './advancedsearch.handler.js';

class AdvancedSearchFeatureDiagramModule extends FeatureDiagramModule {
    override configureActionHandlers(binding: InstanceMultiBinding<ActionHandlerConstructor>): void {
        binding.add(AdvancedSearchActionHandler);
    }
}

export const advancedSearchGlspModule = new AdvancedSearchFeatureDiagramModule();
