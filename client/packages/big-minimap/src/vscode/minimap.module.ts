/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { TYPES } from '@borkdominik-biguml/big-vscode-integration/vscode';
import { ContainerModule } from 'inversify';
import { MinimapProvider, MinimapViewId } from './minimap.provider.js';

export function minimapModule(viewId: string) {
    return new ContainerModule(bind => {
        bind(MinimapViewId).toConstantValue(viewId);
        bind(MinimapProvider).toSelf().inSingletonScope();
        bind(TYPES.RootInitialization).toService(MinimapProvider);
    });
}
