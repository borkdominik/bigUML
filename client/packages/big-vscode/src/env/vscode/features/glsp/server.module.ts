/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { ContainerModule } from 'inversify';
import { TYPES } from '../../vscode-common.types.js';
import { GLSPServerModelState } from './server-model-state.js';

export const experimentalServerModule = new ContainerModule(bind => {
    bind(TYPES.GLSPServerModelState).to(GLSPServerModelState).inSingletonScope();
    bind(TYPES.OnActivate).toService(TYPES.GLSPServerModelState);
});
