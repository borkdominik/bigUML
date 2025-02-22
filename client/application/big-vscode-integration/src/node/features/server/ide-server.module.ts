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
import { IDEServer } from './ide-server.js';
import { IDESessionClient } from './ide-session-client.js';

export const ideServerModule = new ContainerModule(bind => {
    bind(IDEServer).toSelf().inSingletonScope();
    bind(TYPES.IDEServer).toService(IDEServer);
    bind(TYPES.Disposable).toService(TYPES.IDEServer);

    bind(TYPES.IDESessionClient).to(IDESessionClient).inSingletonScope();
});
