/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { RequestClassOutlineActionHandler } from '@borkdominik-biguml/big-outline/gen/glsp-server';
import { FeatureDiagramModule } from '@borkdominik-biguml/uml-glsp-server/vscode';
import type { ActionHandlerConstructor, InstanceMultiBinding } from '@eclipse-glsp/server';

class OutlineFeatureDiagramModule extends FeatureDiagramModule {
    override configureActionHandlers(binding: InstanceMultiBinding<ActionHandlerConstructor>): void {
        binding.add(RequestClassOutlineActionHandler);
    }
}

export const outlineModule = new OutlineFeatureDiagramModule();
