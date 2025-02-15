/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { configureActionHandler } from '@eclipse-glsp/client';
import { ContainerModule } from 'inversify';
import { SetUMLThemeAction } from '../../../common/features/theme/theme.actions.js';
import { ThemeManager } from './theme.manager.js';

export const umlThemeModule = new ContainerModule((bind, _unbind, isBound, rebind) => {
    const context = { bind, _unbind, isBound, rebind };

    bind(ThemeManager).toSelf().inSingletonScope();
    configureActionHandler(context, SetUMLThemeAction.KIND, ThemeManager);
});
