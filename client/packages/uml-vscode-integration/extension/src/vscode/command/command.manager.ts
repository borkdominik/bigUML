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
import { TYPES } from '../../di.types.js';
import { type VSCodeCommand } from './command.js';

@injectable()
export class CommandManager {
    constructor(
        @inject(TYPES.ExtensionContext) protected readonly context: vscode.ExtensionContext,
        @multiInject(TYPES.Command) private commands: VSCodeCommand[]
    ) {}

    @postConstruct()
    initialize(): void {
        for (const c of this.commands) {
            const cmd = vscode.commands.registerCommand(c.id, c.execute, c);
            this.context.subscriptions.push(cmd);
        }
    }
}
