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
import type { AddRelationInput, UmlRelationType } from '../../common/index.js';
import { buildRelationRecord } from './relation-serialization.js';
import { createToolResult, resolveWorkspacePath, validateRequiredString, validateUmlDiagramFile } from './tool-utils.js';
import { stringifyUmlDiagramFile } from './uml-file-format.js';

// Maps UmlRelationType to the GLSP element type ID used in CreateEdgeOperation
const GLSP_EDGE_TYPE_ID: Record<UmlRelationType, string> = {
    Association: 'class__Association',
    Aggregation: 'class__aggregation__Association',
    Composition: 'class__composition__Association',
    Abstraction: 'class__Abstraction',
    Dependency: 'class__Dependency',
    Generalization: 'class__Generalization',
    InterfaceRealization: 'class__InterfaceRealization',
    PackageImport: 'class__PackageImport',
    PackageMerge: 'class__PackageMerge',
    Realization: 'class__Realization',
    Substitution: 'class__Substitution',
    Usage: 'class__Usage'
};

interface UmlNode {
    __id: string;
    name: string;
    [key: string]: unknown;
}

interface UmlDiagramFile {
    diagram: {
        entities: UmlNode[];
        relations: Record<string, unknown>[];
    };
    metaInfos: unknown[];
}

@injectable()
export class AddRelationTool implements vscode.LanguageModelTool<AddRelationInput> {
    constructor(@inject(OutputChannel) protected readonly outputChannel: OutputChannel) {}

    async invoke(
        options: vscode.LanguageModelToolInvocationOptions<AddRelationInput>,
        token: vscode.CancellationToken
    ): Promise<vscode.LanguageModelToolResult> {
        void token;

        const { filePath, relationType, sourceName, targetName, name, sourceMultiplicity, targetMultiplicity } = options.input;
        this.outputChannel.appendLine(`[big-ai] AddRelationTool: ${relationType} from "${sourceName}" to "${targetName}" in ${filePath}`);

        let sourceElementName: string;
        let targetElementName: string;
        let relationName: string | undefined;
        let uri: vscode.Uri;
        try {
            sourceElementName = validateRequiredString(sourceName, 'sourceName');
            targetElementName = validateRequiredString(targetName, 'targetName');
            relationName = name === undefined ? undefined : validateRequiredString(name, 'name');
            if (!Object.prototype.hasOwnProperty.call(GLSP_EDGE_TYPE_ID, relationType)) {
                throw new Error(`Unsupported relationType "${String(relationType)}".`);
            }
            if (sourceMultiplicity !== undefined) validateRequiredString(sourceMultiplicity, 'sourceMultiplicity');
            if (targetMultiplicity !== undefined) validateRequiredString(targetMultiplicity, 'targetMultiplicity');
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

        // Write directly to the file. (The live GLSP createEdge operation saved the diagram server's
        // in-memory model, which silently discarded edits other tools had written straight to the file.
        // The participant refreshes the open diagram after the whole edit batch instead.)
        const relation = buildRelationRecord({
            relationType,
            sourceId: sourceNode.__id,
            targetId: targetNode.__id,
            name: relationName,
            sourceMultiplicity,
            targetMultiplicity
        });
        const id = relation['__id'] as string;

        diagram.diagram.relations.push(relation);
        await vscode.workspace.fs.writeFile(uri, Buffer.from(stringifyUmlDiagramFile(diagram), 'utf-8'));

        this.outputChannel.appendLine(
            `[big-ai] Added ${relationType} from "${sourceElementName}" to "${targetElementName}" (id: ${id}) via file write`
        );
        return createToolResult(`Added ${relationType} from "${sourceElementName}" to "${targetElementName}" (id: ${id}) in ${filePath}`);
    }
}
