/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { RefreshPropertyPaletteAction } from '@borkdominik-biguml/uml-common';
import { configureActionHandler, SelectAction, SetDirtyStateAction } from '@eclipse-glsp/client';
import { ContainerModule } from 'inversify';
import { PropertyPaletteHandler } from './property-palette.handler';

const propertyPaletteModule = new ContainerModule((bind, _unbind, isBound, rebind) => {
    const context = { bind, _unbind, isBound, rebind };

    bind(PropertyPaletteHandler).toSelf().inSingletonScope();
    configureActionHandler(context, SelectAction.KIND, PropertyPaletteHandler);
    configureActionHandler(context, SetDirtyStateAction.KIND, PropertyPaletteHandler);
    configureActionHandler(context, RefreshPropertyPaletteAction.KIND, PropertyPaletteHandler);
});

export default propertyPaletteModule;
