/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { TYPES } from '@borkdominik-biguml/big-vscode-integration/vscode';
import { ContainerModule } from 'inversify';
import { CodeGenerationActionHandler } from './code-generation.handler.js';
import { CodeGenerationProvider, CodeGenerationViewId } from './code-generation.provider.js';

export function codeGenerationModule(viewId: string) {
    return new ContainerModule(bind => {
        bind(CodeGenerationViewId).toConstantValue(viewId);
        bind(CodeGenerationProvider).toSelf().inSingletonScope();
        bind(TYPES.RootInitialization).toService(CodeGenerationProvider);

        // Handle the request vscode side
        // This will prevent the glsp to handle the request
        // Remember to comment out the the glsp client handler found [here](../glsp-client/code-generation.module.ts)!
        // In CodeGenerationActionHandler implementation GLSP has priority over vscode

        bind(CodeGenerationActionHandler).toSelf().inSingletonScope();
        bind(TYPES.Disposable).toService(CodeGenerationActionHandler);
        bind(TYPES.RootInitialization).toService(CodeGenerationActionHandler);
    });
}
