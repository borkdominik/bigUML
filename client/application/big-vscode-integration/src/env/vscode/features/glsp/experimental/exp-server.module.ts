/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { ContainerModule } from 'inversify';
import { EXPERIMENTAL_TYPES, TYPES } from '../../../vscode-common.types.js';
import { ExperimentalGLSPServerModelState } from './exp-server-model-state.js';

export const experimentalServerModule = new ContainerModule(bind => {
    bind(EXPERIMENTAL_TYPES.GLSPServerModelState).to(ExperimentalGLSPServerModelState).inSingletonScope();
    bind(TYPES.RootInitialization).toService(EXPERIMENTAL_TYPES.GLSPServerModelState);
});
