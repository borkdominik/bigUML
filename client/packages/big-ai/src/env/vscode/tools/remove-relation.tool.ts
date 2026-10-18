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
import type { RemoveRelationInput } from '../../common/index.js';
import { createToolResult, resolveWorkspacePath, validateRequiredString, validateUmlDiagramFile } from './tool-utils.js';
import { stringifyUmlDiagramFile } from './uml-file-format.js';

interface UmlNode {
    __id: string;
    name: string;
    [key: string]: unknown;
}

interface UmlRelation {
    __type: string;
    __id: string;
    source?: { __value?: string };
    target?: { __value?: string };
    [key: string]: unknown;
}

interface UmlDiagramFile {
    diagram: {
        entities: UmlNode[];
        relations: UmlRelation[];
    };
    metaInfos: unknown[];
}

@injectable()
export class RemoveRelationTool implements vscode.LanguageModelTool<RemoveRelationInput> {
    constructor(@inject(OutputChannel) protected readonly outputChannel: OutputChannel) {}

    async invoke(
        options: vscode.LanguageModelToolInvocationOptions<RemoveRelationInput>,
        token: vscode.CancellationToken
    ): Promise<vscode.LanguageModelToolResult> {
        void token;

        const { filePath, sourceName, targetName, relationType } = options.input;
        this.outputChannel.appendLine(`[big-ai] RemoveRelationTool: relation from "${sourceName}" to "${targetName}" in ${filePath}`);

        let sourceElementName: string;
        let targetElementName: string;
        let uri: vscode.Uri;
        try {
            sourceElementName = validateRequiredString(sourceName, 'sourceName');
            targetElementName = validateRequiredString(targetName, 'targetName');
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

        const sourceNode = diagram.diagram.entities.find(e => e.name === sourceElementName);
        if (!sourceNode) {
            return createToolResult(`Error: No element named "${sourceElementName}" found in ${filePath}`);
        }

        const targetNode = diagram.diagram.entities.find(e => e.name === targetElementName);
        if (!targetNode) {
            return createToolResult(`Error: No element named "${targetElementName}" found in ${filePath}`);
        }

        const index = diagram.diagram.relations.findIndex(r => {
            const srcMatch = r.source?.__value === sourceNode.__id;
            const tgtMatch = r.target?.__value === targetNode.__id;
            const typeMatch = relationType === undefined || r.__type === relationType;
            return srcMatch && tgtMatch && typeMatch;
        });

        if (index === -1) {
            const typeHint = relationType ? ` of type ${relationType}` : '';
            return createToolResult(
                `Error: No relation${typeHint} from "${sourceElementName}" to "${targetElementName}" found in ${filePath}`
            );
        }

        // Write directly to the file so the change isn't lost when the diagram server later saves its
        // in-memory model. The participant refreshes the open diagram after the edit batch.
        const [removed] = diagram.diagram.relations.splice(index, 1);
        try {
            await vscode.workspace.fs.writeFile(uri, Buffer.from(stringifyUmlDiagramFile(diagram), 'utf-8'));
        } catch (e) {
            return createToolResult(`Error: ${e instanceof Error ? e.message : String(e)}`);
        }

        this.outputChannel.appendLine(
            `[big-ai] Removed ${removed.__type} from "${sourceElementName}" to "${targetElementName}" (id: ${removed.__id}) via file write`
        );
        return createToolResult(`Removed ${removed.__type} from "${sourceElementName}" to "${targetElementName}" in ${filePath}`);
    }
}
