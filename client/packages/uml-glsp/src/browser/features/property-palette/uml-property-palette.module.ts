/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { RefreshPropertyPaletteAction } from '@borkdominik-biguml/uml-protocol';
import { configureActionHandler, FeatureModule, SelectAction, TYPES } from '@eclipse-glsp/client';
import { PropertyPaletteHandler } from './property-palette.handler.js';

export const umlPropertyPaletteModule = new FeatureModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };

    bind(PropertyPaletteHandler).toSelf().inSingletonScope();
    bind(TYPES.IGModelRootListener).toService(PropertyPaletteHandler);
    configureActionHandler(context, SelectAction.KIND, PropertyPaletteHandler);
    configureActionHandler(context, RefreshPropertyPaletteAction.KIND, PropertyPaletteHandler);
});
