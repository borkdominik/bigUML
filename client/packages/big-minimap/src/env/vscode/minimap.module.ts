/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { bindWebviewViewFactory, TYPES } from '@borkdominik-biguml/big-vscode/vscode';
import { ContainerModule } from 'inversify';
import { MinimapProvider } from './minimap.provider.js';

export function minimapModule(viewId: string) {
    return new ContainerModule(bind => {
        bindWebviewViewFactory(bind, {
            provider: MinimapProvider,
            configure: childBind => {
                childBind(TYPES.WebviewViewOptions).toConstantValue({
                    viewId,
                    viewType: viewId,
                    files: {
                        js: [['minimap', 'bundle.js']],
                        css: [['minimap', 'bundle.css']]
                    }
                });
            }
        });
    });
}
