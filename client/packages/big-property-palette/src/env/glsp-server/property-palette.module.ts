/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { DiagramFeatureModule } from '@borkdominik-biguml/uml-glsp-server/vscode';
import type { ActionHandlerConstructor, InstanceMultiBinding } from '@eclipse-glsp/server';
import { GenericUpdateElementPropertyActionHandler } from './generic-element-property-action-handler.js';
import { RequestPropertyPaletteActionHandler } from './request-property-palette-action-handler.js';

class PropertyPaletteDiagramFeatureModule extends DiagramFeatureModule {
    override configureActionHandlers(binding: InstanceMultiBinding<ActionHandlerConstructor>): void {
        binding.add(RequestPropertyPaletteActionHandler);
        binding.add(GenericUpdateElementPropertyActionHandler);
    }
}

export const propertyPaletteModule = new PropertyPaletteDiagramFeatureModule();
