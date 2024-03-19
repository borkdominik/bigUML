/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { ContainerModule } from 'inversify';
import { TYPES } from '../../di.types';
import { PropertyPaletteProvider } from './property-palette.provider';

export const propertyPaletteModule = new ContainerModule(bind => {
    bind(PropertyPaletteProvider).toSelf().inSingletonScope();
    bind(TYPES.RootInitialization).toService(PropertyPaletteProvider);
});
