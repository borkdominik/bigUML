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
import { NewFileCommand } from './new-file/new-file.command.js';
import { NewFileCreator } from './new-file/new-file.creator.js';
import { Settings } from './settings/settings.js';

export const vscodeModule = new ContainerModule(bind => {
    bind(NewFileCreator).toSelf().inSingletonScope();
    bind(TYPES.Command).to(NewFileCommand);

    bind(Settings).toSelf().inSingletonScope();
    bind(TYPES.Settings).toService(Settings);
    bind(TYPES.RootInitialization).toService(Settings);
});
