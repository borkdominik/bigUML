/*********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { TYPES } from '@borkdominik-biguml/big-vscode/vscode';
import { ContainerModule } from 'inversify';
import { AdvancedSearchProvider, AdvancedSearchViewId } from './advancedsearch.provider.js';

export function advancedSearchModule(viewId: string) {
    return new ContainerModule(bind => {
        bind(AdvancedSearchViewId).toConstantValue(viewId);
        bind(AdvancedSearchProvider).toSelf().inSingletonScope();
        bind(TYPES.RootInitialization).toService(AdvancedSearchProvider);
    });
}
