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
import { CodeToClassDiagramActionHandler } from './code-to-class-diagram.handler.js';
import { CodeToClassDiagramProvider, CodeToClassDiagramViewId } from './code-to-class-diagram.provider.js';

export function codeToClassDiagramModule(viewId: string) {
    return new ContainerModule(bind => {
        bind(CodeToClassDiagramViewId).toConstantValue(viewId);
        bind(CodeToClassDiagramProvider).toSelf().inSingletonScope();
        bind(TYPES.RootInitialization).toService(CodeToClassDiagramProvider);

        // Handle the request vscode side
        // This will prevent the glsp to handle the request
        // Remember to comment out the the glsp client handler!
        // In CodeToClassDiagramActionHandler implementation GLSP has priority over vscode

        // Uncommented
        bind(CodeToClassDiagramActionHandler).toSelf().inSingletonScope();
        bind(TYPES.Disposable).toService(CodeToClassDiagramActionHandler);
        bind(TYPES.RootInitialization).toService(CodeToClassDiagramActionHandler);
    });
}
