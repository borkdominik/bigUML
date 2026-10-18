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
import type { ProposeDiagramInput } from '../../common/index.js';
import { createToolResult } from './tool-utils.js';

@injectable()
export class ProposeDiagramTool implements vscode.LanguageModelTool<ProposeDiagramInput> {
    constructor(@inject(OutputChannel) protected readonly outputChannel: OutputChannel) {}

    async invoke(
        options: vscode.LanguageModelToolInvocationOptions<ProposeDiagramInput>,
        token: vscode.CancellationToken
    ): Promise<vscode.LanguageModelToolResult> {
        void token;
        // The participant intercepts this call to render the summary and arm the gate.
        // This body only runs if invoked outside that flow.
        const entityCount = options.input?.entities?.length ?? 0;
        this.outputChannel.appendLine(`[big-ai] ProposeDiagramTool invoked (${entityCount} entities)`);
        return createToolResult('Proposal received.');
    }
}
