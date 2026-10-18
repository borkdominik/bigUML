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
import type { ConfirmGenerationInput } from '../../common/index.js';
import { createToolResult } from './tool-utils.js';

@injectable()
export class ConfirmGenerationTool implements vscode.LanguageModelTool<ConfirmGenerationInput> {
    constructor(@inject(OutputChannel) protected readonly outputChannel: OutputChannel) {}

    async invoke(
        options: vscode.LanguageModelToolInvocationOptions<ConfirmGenerationInput>,
        token: vscode.CancellationToken
    ): Promise<vscode.LanguageModelToolResult> {
        void token;
        void options;
        // The participant intercepts this call to generate from the stored proposal.
        this.outputChannel.appendLine('[big-ai] ConfirmGenerationTool invoked');
        return createToolResult('Confirmed.');
    }
}
