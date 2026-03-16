/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { TYPES } from '../../../vscode/vscode-common.types.js';
import { bindLifecycle } from '../container/bindings.js';
import { VscodeFeatureModule } from '../container/container.js';
import { IDEServer } from './ide-server.js';
import { IDESessionClient } from './ide-session-client.js';

export const ideServerModule = new VscodeFeatureModule(context => {
    bindLifecycle(context, TYPES.IdeServer, IDEServer);

    context.bind(TYPES.IdeSessionClient).to(IDESessionClient).inSingletonScope();
});
