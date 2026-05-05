/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { inject, injectable, multiInject, postConstruct } from 'inversify';
import * as vscode from 'vscode';
import { TYPES } from '../../vscode-common.types.js';
import { type VSCodeCommand } from './command.js';

/**
 * This class is responsible for managing the commands in the VSCode extension by using Dependency Injection.
 * It registers all commands and handles their execution.
 * Use {@link TYPES.Command} to register commands in the extension.
 *
 * @see {@link VSCodeCommand} for more information.
 */
@injectable()
export class CommandManager {
    constructor(
        @inject(TYPES.ExtensionContext) protected readonly context: vscode.ExtensionContext,
        @multiInject(TYPES.Command) private commands: VSCodeCommand[]
    ) {}

    @postConstruct()
    initialize(): void {
        for (const command of this.commands) {
            const cmd = vscode.commands.registerCommand(command.id, command.execute, command);
            this.context.subscriptions.push(cmd);
        }
    }
}
