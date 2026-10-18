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
import type { CreateUmlFileInput } from '../../common/index.js';
import { createToolResult, resolveWorkspacePath, validateRequiredString } from './tool-utils.js';
import { emptyUmlDiagramFile, stringifyUmlDiagramFile } from './uml-file-format.js';

@injectable()
export class CreateUmlFileTool implements vscode.LanguageModelTool<CreateUmlFileInput> {
    constructor(@inject(OutputChannel) protected readonly outputChannel: OutputChannel) {}

    async invoke(
        options: vscode.LanguageModelToolInvocationOptions<CreateUmlFileInput>,
        token: vscode.CancellationToken
    ): Promise<vscode.LanguageModelToolResult> {
        void token;

        const { filePath, diagramType } = options.input;
        this.outputChannel.appendLine(`[big-ai] CreateUmlFileTool: ${filePath} (${diagramType})`);

        let uri: vscode.Uri;
        try {
            if (diagramType !== 'CLASS' && diagramType !== 'DEPLOYMENT' && diagramType !== 'ACTIVITY') {
                throw new Error('diagramType must be CLASS, DEPLOYMENT, or ACTIVITY.');
            }
            const requestedPath = validateRequiredString(filePath, 'filePath');
            const normalized = requestedPath.toLowerCase().endsWith('.uml') ? requestedPath : `${requestedPath}.uml`;
            uri = resolveWorkspacePath(normalized, { requireUmlExtension: true });
        } catch (e) {
            return createToolResult(`Error: ${e instanceof Error ? e.message : String(e)}`);
        }

        try {
            await vscode.workspace.fs.stat(uri);
            return createToolResult(`Error: File already exists at ${uri.fsPath}. Choose a different path.`);
        } catch {
            // File does not exist — proceed
        }

        const content = stringifyUmlDiagramFile(emptyUmlDiagramFile(diagramType));
        await vscode.workspace.fs.writeFile(uri, Buffer.from(content, 'utf-8'));

        this.outputChannel.appendLine(`[big-ai] Created UML file: ${uri.fsPath}`);
        return createToolResult(`Created UML file at ${uri.fsPath}`);
    }
}
