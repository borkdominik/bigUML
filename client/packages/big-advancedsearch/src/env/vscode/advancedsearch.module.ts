/*********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { bindWebviewViewFactory, VscodeFeatureModule } from '@borkdominik-biguml/big-vscode/vscode';
import { AdvancedSearchWebviewViewProvider } from './advancedsearch.webview-view-provider.js';

export function advancedSearchModule(viewType: string) {
    return new VscodeFeatureModule(context => {
        bindWebviewViewFactory(context, {
            provider: AdvancedSearchWebviewViewProvider,
            options: {
                viewType
            }
        });
    });
}
