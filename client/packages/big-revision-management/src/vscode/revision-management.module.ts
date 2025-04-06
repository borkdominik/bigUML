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
import { RevisionManagementProvider, RevisionManagementId } from './revision-management.provider.js';

export function revisionManagementModule(viewId: string) {
    return new ContainerModule(bind => {
        bind(RevisionManagementId).toConstantValue(viewId);
        bind(RevisionManagementProvider).toSelf().inSingletonScope();
        bind(TYPES.RootInitialization).toService(RevisionManagementProvider);

        // Handle the request vscode side
        // This will prevent the glsp to handle the request
        // Remember to comment out the the glsp client handler!
        // In HelloWorldActionHandler implementation GLSP has priority over vscode

        // bind(HelloWorldActionHandler).toSelf().inSingletonScope();
        // bind(TYPES.Disposable).toService(HelloWorldActionHandler);
        // bind(TYPES.RootInitialization).toService(HelloWorldActionHandler);
    });
}
