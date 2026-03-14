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
import { AdvancedSearchProvider } from './advancedsearch.provider.js';

export function advancedSearchModule(viewId: string) {
    return new ContainerModule(bind => {
        bindWebviewViewFactory(bind, {
            provider: AdvancedSearchProvider,
            configure: bind => {
                bind(TYPES.WebviewViewOptions).toConstantValue({
                    viewId,
                    viewType: viewId,
                    files: {
                        js: [['advancedsearch', 'bundle.js']],
                        css: [['advancedsearch', 'bundle.css']]
                    }
                });
            }
        });
    });
}
