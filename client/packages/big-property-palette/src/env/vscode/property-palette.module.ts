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
import { PropertyPaletteProvider } from './property-palette.provider.js';

export function propertyPaletteModule(viewId: string) {
    return new ContainerModule(bind => {
        bindWebviewViewFactory(bind, {
            provider: PropertyPaletteProvider,
            configure: childBind => {
                childBind(TYPES.WebviewViewOptions).toConstantValue({
                    viewId,
                    viewType: viewId,
                    files: {
                        js: [['property-palette', 'bundle.js']],
                        css: [['property-palette', 'bundle.css']]
                    }
                });
            }
        });
    });
}
