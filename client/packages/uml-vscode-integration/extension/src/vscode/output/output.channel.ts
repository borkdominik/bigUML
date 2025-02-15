/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { inject, injectable } from 'inversify';
import * as vscode from 'vscode';
import { TYPES } from '../../di.types.js';

@injectable()
export class OutputChannel {
    protected readonly _channel;

    constructor(@inject(TYPES.ExtensionContext) context: vscode.ExtensionContext) {
        this._channel = vscode.window.createOutputChannel(context.extension.packageJSON['displayName'] ?? context.extension.id);
    }

    get channel(): vscode.OutputChannel {
        return this._channel;
    }

    appendLine(message: string): void {
        this.channel.appendLine(message);
    }

    error(error: Error): void {
        this.channel.appendLine(error.stack ?? error.name);
    }
}
