/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { OutputChannel } from '@borkdominik-biguml/big-vscode/vscode';
import { inject, injectable } from 'inversify';
import type * as vscode from 'vscode';
import type { DummyToolInput } from '../../common/index.js';
import { createToolResult } from './tool-utils.js';

@injectable()
export class DummyTool implements vscode.LanguageModelTool<DummyToolInput> {
    constructor(@inject(OutputChannel) protected readonly outputChannel: OutputChannel) {}

    async invoke(
        options: vscode.LanguageModelToolInvocationOptions<DummyToolInput>,
        token: vscode.CancellationToken
    ): Promise<vscode.LanguageModelToolResult> {
        void token;

        this.outputChannel.appendLine(`[big-ai] DummyTool invoked: ${JSON.stringify(options.input)}`);

        return createToolResult(`Dummy tool invoked with message: ${options.input.message}`);
    }
}
