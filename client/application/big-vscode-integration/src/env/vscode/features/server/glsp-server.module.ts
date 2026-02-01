/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { ContainerModule } from 'inversify';
import { TYPES } from '../../../vscode/vscode-common.types.js';
import { GLSPServer } from './glsp-server.js';

export interface GLSPServerConfig {
    port: number;
}

export function glspServerModule(config: GLSPServerConfig): ContainerModule {
    return new ContainerModule(bind => {
        bind(TYPES.GLSPServerConfig).toConstantValue(config);

        bind(GLSPServer).toSelf().inSingletonScope();
        bind(TYPES.GLSPServer).toService(GLSPServer);
        bind(TYPES.Disposable).toService(TYPES.GLSPServer);
    });
}
