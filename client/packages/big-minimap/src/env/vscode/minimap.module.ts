/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { bindWebviewViewFactory, VscodeFeatureModule } from '@borkdominik-biguml/big-vscode/vscode';
import { MinimapWebviewViewProvider } from './minimap.webview-view-provider.js';

export function minimapModule(viewType: string) {
    return new VscodeFeatureModule(context => {
        bindWebviewViewFactory(context, {
            provider: MinimapWebviewViewProvider,
            options: {
                viewType
            }
        });
    });
}
