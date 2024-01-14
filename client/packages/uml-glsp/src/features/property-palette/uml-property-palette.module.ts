/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { RefreshPropertyPaletteAction } from '@borkdominik-biguml/uml-common';
import { configureActionHandler, FeatureModule, SelectAction, SetDirtyStateAction } from '@eclipse-glsp/client';
import { PropertyPaletteHandler } from './property-palette.handler';

export const umlPropertyPaletteModule = new FeatureModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };

    bind(PropertyPaletteHandler).toSelf().inSingletonScope();
    configureActionHandler(context, SelectAction.KIND, PropertyPaletteHandler);
    configureActionHandler(context, SetDirtyStateAction.KIND, PropertyPaletteHandler);
    configureActionHandler(context, RefreshPropertyPaletteAction.KIND, PropertyPaletteHandler);
});
