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
import * as vscode from 'vscode';
import type { ReadUmlFileInput } from '../../common/index.js';
import { createToolResult, resolveWorkspacePath } from './tool-utils.js';

@injectable()
export class ReadUmlFileTool implements vscode.LanguageModelTool<ReadUmlFileInput> {
    constructor(@inject(OutputChannel) protected readonly outputChannel: OutputChannel) {}

    async invoke(
        options: vscode.LanguageModelToolInvocationOptions<ReadUmlFileInput>,
        token: vscode.CancellationToken
    ): Promise<vscode.LanguageModelToolResult> {
        void token;

        const { filePath } = options.input;
        this.outputChannel.appendLine(`[big-ai] ReadUmlFileTool: ${filePath}`);

        let uri: vscode.Uri;
        try {
            uri = resolveWorkspacePath(filePath, { requireUmlExtension: true });
        } catch (e) {
            return createToolResult(`Error: ${e instanceof Error ? e.message : String(e)}`);
        }

        let content: Uint8Array;
        try {
            content = await vscode.workspace.fs.readFile(uri);
        } catch {
            return createToolResult(`Error: File not found at ${filePath}`);
        }

        const text = Buffer.from(content).toString('utf-8');
        this.outputChannel.appendLine(`[big-ai] Read UML file: ${uri.fsPath} (${text.length} chars)`);
        return createToolResult(text);
    }
}
