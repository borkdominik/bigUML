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
import { ThemeIntegration } from './theme-integration';

export const themeModule = new ContainerModule(bind => {
    bind(ThemeIntegration).toSelf().inSingletonScope();
    bind(TYPES.Theme).toService(ThemeIntegration);
    bind(TYPES.Disposable).toService(ThemeIntegration);
    bind(TYPES.RootInitialization).toService(ThemeIntegration);
});
