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
import type { CompleteInterviewStepInput } from '../../common/index.js';
import { createToolResult } from './tool-utils.js';

@injectable()
export class CompleteInterviewStepTool implements vscode.LanguageModelTool<CompleteInterviewStepInput> {
    constructor(@inject(OutputChannel) protected readonly outputChannel: OutputChannel) {}

    async invoke(
        options: vscode.LanguageModelToolInvocationOptions<CompleteInterviewStepInput>,
        token: vscode.CancellationToken
    ): Promise<vscode.LanguageModelToolResult> {
        void token;

        const stepNumber = options.input?.stepNumber;
        this.outputChannel.appendLine(`[big-ai] CompleteInterviewStepTool invoked for step ${stepNumber ?? 'unknown'}`);

        return createToolResult(`Step ${stepNumber ?? 'unknown'} completion signaled.`);
    }
}
