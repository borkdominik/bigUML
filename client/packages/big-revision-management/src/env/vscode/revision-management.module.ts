/*********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { bindWebviewViewFactory, TYPES } from '@borkdominik-biguml/big-vscode/vscode';
import { ContainerModule } from 'inversify';
import { RevisionManagementProvider } from './revision-management.provider.js';
import { RevisionManagementService } from './revision-management.service.js';

export function revisionManagementModule(viewId: string) {
    return new ContainerModule(bind => {
        bind(RevisionManagementService).toSelf().inSingletonScope();
        // Bind service to RootInitialization to ensure it starts tracking immediately
        bind(TYPES.RootInitialization).toService(RevisionManagementService);

        bindWebviewViewFactory(bind, {
            provider: RevisionManagementProvider,
            configure: childBind => {
                childBind(TYPES.WebviewViewOptions).toConstantValue({
                    viewId,
                    viewType: viewId,
                    files: {
                        js: [['revision-management', 'bundle.js']],
                        css: [['revision-management', 'bundle.css']]
                    }
                });
            }
        });
    });
}
