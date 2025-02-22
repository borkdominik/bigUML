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
import { OutputChannel } from './output.channel.js';

export const outputModule = new ContainerModule(bind => {
    bind(OutputChannel).toSelf().inSingletonScope();
    bind(TYPES.OutputChannel).toService(OutputChannel);
});
