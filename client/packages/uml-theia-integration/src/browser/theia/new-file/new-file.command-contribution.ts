/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { CommandContribution, CommandRegistry } from '@theia/core/lib/common/command';
import { inject, injectable } from 'inversify';
import { NEW_FILE_COMMAND } from './new-file.command';

import { NewFileCreator } from './new-file.creator';

@injectable()
export class NewFileCommandContribution implements CommandContribution {
    @inject(NewFileCreator) protected readonly creator: NewFileCreator;

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(NEW_FILE_COMMAND, {
            execute: async () => {
                await this.creator.create();
            }
        });
    }
}
