/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { TYPES } from '../../vscode-common.types.js';
import { bindLifecycle } from '../container/bindings.js';
import { VscodeFeatureModule } from '../container/container.js';
import { CommandManager } from './command.manager.js';
import { NewFileCommand } from './new-file/new-file.command.js';
import { NewFileCreator } from './new-file/new-file.creator.js';

export const commandModule = new VscodeFeatureModule(context => {
    bindLifecycle(context, TYPES.CommandManager, CommandManager);

    context.bind(NewFileCreator).toSelf().inSingletonScope();
    context.bind(TYPES.Command).to(NewFileCommand);
});
