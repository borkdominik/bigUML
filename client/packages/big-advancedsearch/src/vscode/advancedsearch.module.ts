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
import { AdvancedSearchProvider, AdvancedSearchViewId } from './advancedsearch.provider.js';

export function advancedSearchModule(viewId: string) {
    return new ContainerModule(bind => {
        bind(AdvancedSearchViewId).toConstantValue(viewId);
        bind(AdvancedSearchProvider).toSelf().inSingletonScope();
        bind(TYPES.RootInitialization).toService(AdvancedSearchProvider);

        // Handle the request vscode side
        // This will prevent the glsp to handle the request
        // Remember to comment out the the glsp client handler!
        // In AdvancedSearchActionHandler implementation GLSP has priority over vscode

        // bind(AdvancedSearchActionHandler).toSelf().inSingletonScope();
        // bind(TYPES.Disposable).toService(AdvancedSearchActionHandler);
        // bind(TYPES.RootInitialization).toService(AdvancedSearchActionHandler);
    });
}
