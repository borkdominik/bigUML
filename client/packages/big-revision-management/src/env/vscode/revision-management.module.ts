/*********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { bindWebviewViewFactory, TYPES, VscodeFeatureModule } from '@borkdominik-biguml/big-vscode/vscode';
import { RevisionManagementService } from './revision-management.service.js';
import { RevisionManagementWebviewViewProvider } from './revision-management.webview-view-provider.js';

export function revisionManagementModule(viewType: string) {
    return new VscodeFeatureModule(context => {
        context.bind(RevisionManagementService).toSelf().inSingletonScope();
        context.bind(TYPES.OnActivate).toService(RevisionManagementService);

        bindWebviewViewFactory(context, {
            provider: RevisionManagementWebviewViewProvider,
            options: {
                viewType
            }
        });
    });
}
