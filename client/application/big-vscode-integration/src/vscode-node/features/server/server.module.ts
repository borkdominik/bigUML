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
import { ServerManager } from './server.manager.js';

export const serverModule = new ContainerModule(bind => {
    bind(ServerManager).toSelf().inSingletonScope();
    bind(TYPES.ServerManager).toService(ServerManager);
});
