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
import { GlspModelState } from './glsp-model-state.js';

export const glspModule = new ContainerModule(bind => {
    bind(TYPES.GlspModelState).to(GlspModelState).inSingletonScope();
    bind(TYPES.OnActivate).toService(TYPES.GlspModelState);
});
