/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { type Container } from 'inversify';
import { glspServerModule, type GLSPServerConfig } from './features/server/glsp-server.module.js';
import { ideServerModule } from './features/server/ide-server.module.js';
import { serverModule } from './features/server/server.module.js';

export function loadVSCodeNodeContainer(
    container: Container,
    options: {
        glspServerConfig: GLSPServerConfig;
    }
): Container {
    container.load(serverModule, glspServerModule(options.glspServerConfig), ideServerModule);

    return container;
}
