/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { TYPES } from '@borkdominik-biguml/big-vscode-integration/vscode';
import { FeatureModule } from '@eclipse-glsp/client';
import { ThemeIntegration } from './theme-integration.js';

export const themeModule = new FeatureModule(bind => {
    bind(ThemeIntegration).toSelf().inSingletonScope();
    bind(TYPES.Theme).toService(ThemeIntegration);
    bind(TYPES.Disposable).toService(ThemeIntegration);
    bind(TYPES.RootInitialization).toService(ThemeIntegration);
});
