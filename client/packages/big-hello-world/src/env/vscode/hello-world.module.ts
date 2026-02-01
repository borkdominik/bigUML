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
import { HelloWorldProvider, HelloWorldViewId } from './hello-world.provider.js';

export function helloWorldModule(viewId: string) {
    return new ContainerModule(bind => {
        bind(HelloWorldViewId).toConstantValue(viewId);
        bind(HelloWorldProvider).toSelf().inSingletonScope();
        bind(TYPES.RootInitialization).toService(HelloWorldProvider);

        // Handle the request vscode side
        // This will prevent the glsp to handle the request
        // Remember to comment out the the glsp client handler!
        // In HelloWorldActionHandler implementation GLSP has priority over vscode

        // bind(HelloWorldActionHandler).toSelf().inSingletonScope();
        // bind(TYPES.Disposable).toService(HelloWorldActionHandler);
        // bind(TYPES.RootInitialization).toService(HelloWorldActionHandler);
    });
}
