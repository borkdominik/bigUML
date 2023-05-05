/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { configureActionHandler, SelectAction, SetDirtyStateAction, TYPES } from '@eclipse-glsp/client';
import { ContainerModule } from 'inversify';

import { EDITOR_PANEL_TYPES } from '../editor-panel/di.types';
import { PropertyPalette } from './property-palette.extension';

const propertyPaletteModule = new ContainerModule((bind, _unbind, isBound, rebind) => {
    const context = { bind, _unbind, isBound, rebind };

    bind(PropertyPalette).toSelf().inSingletonScope();
    bind(EDITOR_PANEL_TYPES.Child).toService(PropertyPalette);
    bind(TYPES.SModelRootListener).toService(PropertyPalette);

    configureActionHandler(context, SelectAction.KIND, PropertyPalette);
    configureActionHandler(context, SetDirtyStateAction.KIND, PropertyPalette);
});

export default propertyPaletteModule;
