/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { bindWebviewViewFactory, TYPES, VscodeFeatureModule } from '@borkdominik-biguml/big-vscode/vscode';
import { ExportInstancesCommand } from './export.command.js';
import { InstanceExportService } from './export.service.js';
import { InstanceExplorerWebviewViewProvider } from './instance-explorer.webview-view-provider.js';

export function instanceExplorerModule(viewType: string) {
    return new VscodeFeatureModule(context => {
        context.bind(InstanceExportService).toSelf().inSingletonScope();
        context.bind(TYPES.OnActivate).toService(InstanceExportService);
        context.bind(TYPES.OnDispose).toService(InstanceExportService);
        context.bind(TYPES.Command).to(ExportInstancesCommand);

        bindWebviewViewFactory(context, {
            provider: InstanceExplorerWebviewViewProvider,
            options: {
                viewType
            }
        });
    });
}
