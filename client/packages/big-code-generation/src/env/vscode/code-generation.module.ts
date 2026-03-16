/*********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { bindWebviewViewFactory, TYPES, VscodeFeatureModule } from '@borkdominik-biguml/big-vscode/vscode';
import { CodeGenerationActionHandler } from './code-generation.handler.js';
import { CodeGenerationWebviewViewProvider } from './code-generation.webview-view-provider.js';

export function codeGenerationModule(viewType: string) {
    return new VscodeFeatureModule(context => {
        context.bind(CodeGenerationActionHandler).toSelf().inSingletonScope();
        context.bind(TYPES.OnActivate).toService(CodeGenerationActionHandler);
        context.bind(TYPES.OnDispose).toService(CodeGenerationActionHandler);

        bindWebviewViewFactory(context, {
            provider: CodeGenerationWebviewViewProvider,
            options: {
                viewType
            }
        });
    });
}
