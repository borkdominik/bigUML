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
import type { RemoveNodeInput } from '../../common/index.js';
import { createToolResult, resolveWorkspacePath, validateRequiredString, validateUmlDiagramFile } from './tool-utils.js';
import { stringifyUmlDiagramFile } from './uml-file-format.js';

interface UmlNode {
    __type: string;
    __id: string;
    name: string;
    [key: string]: unknown;
}

interface ClassDiagram {
    __type: 'ClassDiagram';
    __id: string;
    diagramType: 'CLASS';
    entities: UmlNode[];
    relations: UmlNode[];
}

interface MetaInfo {
    __type: string;
    __id: string;
    [key: string]: unknown;
}

interface UmlDiagramFile {
    diagram: ClassDiagram;
    metaInfos: MetaInfo[];
}

@injectable()
export class RemoveNodeTool implements vscode.LanguageModelTool<RemoveNodeInput> {
    constructor(@inject(OutputChannel) protected readonly outputChannel: OutputChannel) {}

    async invoke(
        options: vscode.LanguageModelToolInvocationOptions<RemoveNodeInput>,
        token: vscode.CancellationToken
    ): Promise<vscode.LanguageModelToolResult> {
        void token;

        const { filePath, elementName } = options.input;
        this.outputChannel.appendLine(`[big-ai] RemoveNodeTool: "${elementName}" from ${filePath}`);

        let name: string;
        let uri: vscode.Uri;
        try {
            name = validateRequiredString(elementName, 'elementName');
            uri = resolveWorkspacePath(filePath, { requireUmlExtension: true });
        } catch (e) {
            return createToolResult(`Error: ${e instanceof Error ? e.message : String(e)}`);
        }

        let diagram: UmlDiagramFile;
        try {
            const raw = await vscode.workspace.fs.readFile(uri);
            const parsed = JSON.parse(Buffer.from(raw).toString('utf-8'));
            validateUmlDiagramFile(parsed);
            diagram = parsed as UmlDiagramFile;
        } catch (e) {
            return createToolResult(`Error: Could not read or parse file at ${filePath}: ${e instanceof Error ? e.message : String(e)}`);
        }

        const index = diagram.diagram.entities.findIndex(e => e.name === name);
        if (index === -1) {
            return createToolResult(`Error: No element named "${name}" found in ${filePath}`);
        }

        // Write directly to the file so the change isn't lost when the diagram server later saves its
        // in-memory model. The participant refreshes the open diagram after the edit batch.
        const [removed] = diagram.diagram.entities.splice(index, 1);
        const removedId = removed.__id;

        diagram.diagram.relations = diagram.diagram.relations.filter(r => {
            const src = (r['source'] as { __value?: string } | undefined)?.__value;
            const tgt = (r['target'] as { __value?: string } | undefined)?.__value;
            return src !== removedId && tgt !== removedId;
        });

        diagram.metaInfos = diagram.metaInfos.filter(m => m.__id !== `size_${removedId}` && m.__id !== `pos_${removedId}`);

        try {
            await vscode.workspace.fs.writeFile(uri, Buffer.from(stringifyUmlDiagramFile(diagram), 'utf-8'));
        } catch (e) {
            return createToolResult(`Error: ${e instanceof Error ? e.message : String(e)}`);
        }

        this.outputChannel.appendLine(`[big-ai] Removed "${name}" (id: ${removedId}) via file write`);
        return createToolResult(`Removed "${name}" from ${filePath}`);
    }
}
