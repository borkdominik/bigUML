/********************************************************************************
 * Copyright (c) 2021-2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

import { inject, injectable, multiInject, postConstruct } from 'inversify';
import * as vscode from 'vscode';
import { VSCODE_TYPES } from '../../di.types';
import { VSCodeCommand } from './command';

@injectable()
export class CommandManager {
    constructor(
        @inject(VSCODE_TYPES.ExtensionContext) protected readonly context: vscode.ExtensionContext,
        @multiInject(VSCODE_TYPES.Command) private commands: VSCodeCommand[]
    ) {}

    @postConstruct()
    initialize(): void {
        for (const c of this.commands) {
            const cmd = vscode.commands.registerCommand(c.id, c.execute, c);
            this.context.subscriptions.push(cmd);
        }
    }
}
