/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
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
