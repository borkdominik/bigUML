/*********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { TYPES } from '@borkdominik-biguml/big-vscode-integration/vscode';
import { ContainerModule } from 'inversify';
import { RevisionManagementId, RevisionManagementProvider } from './revision-management.provider.js';
import { RevisionManagementService } from './revision-management.service.js';

export function revisionManagementModule(viewId: string) {
    return new ContainerModule(bind => {
        bind(RevisionManagementId).toConstantValue(viewId);
        bind(RevisionManagementProvider).toSelf().inSingletonScope();
        bind(RevisionManagementService).toSelf().inSingletonScope();

        // Bind service to RootInitialization to ensure it starts tracking immediately
        bind(TYPES.RootInitialization).toService(RevisionManagementService);
        bind(TYPES.RootInitialization).toService(RevisionManagementProvider);

        // Handle the request vscode side
        // This will prevent the glsp to handle the request
        // Remember to comment out the the glsp client handler!
        // In HelloWorldActionHandler implementation GLSP has priority over vscode
    });
}
