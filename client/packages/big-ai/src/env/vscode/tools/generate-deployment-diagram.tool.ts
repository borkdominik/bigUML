/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { OutputChannel } from '@borkdominik-biguml/big-vscode/vscode';
import { randomUUID } from 'crypto';
import { inject, injectable } from 'inversify';
import * as vscode from 'vscode';
import type { DeploymentNodeType, DeploymentRelationType, GenerateDeploymentDiagramInput } from '../../common/index.js';
import { createToolResult, resolveWorkspacePath, validateRequiredString } from './tool-utils.js';
import { stringifyUmlDiagramFile } from './uml-file-format.js';

interface UmlNode {
    __type: string;
    __id: string;
    name: string;
    visibility: 'PUBLIC' | 'PRIVATE' | 'PROTECTED' | 'PACKAGE';
    [key: string]: unknown;
}

interface UmlDiagramFile {
    diagram: {
        __type: 'DeploymentDiagram';
        __id: string;
        diagramType: 'DEPLOYMENT';
        entities: UmlNode[];
        relations: Record<string, unknown>[];
    };
    metaInfos: Record<string, unknown>[];
}

const NODE_TYPES = new Set<DeploymentNodeType>([
    'Artifact',
    'Device',
    'ExecutionEnvironment',
    'DeploymentNode',
    'DeploymentSpecification',
    'DeploymentPackage',
    'DeploymentModel'
]);
const RELATION_TYPES = new Set<DeploymentRelationType>([
    'CommunicationPath',
    'Deployment',
    'Dependency',
    'Generalization',
    'Manifestation'
]);

@injectable()
export class GenerateDeploymentDiagramTool implements vscode.LanguageModelTool<GenerateDeploymentDiagramInput> {
    constructor(@inject(OutputChannel) protected readonly outputChannel: OutputChannel) {}

    async invoke(
        options: vscode.LanguageModelToolInvocationOptions<GenerateDeploymentDiagramInput>,
        token: vscode.CancellationToken
    ): Promise<vscode.LanguageModelToolResult> {
        void token;

        let uri: vscode.Uri;
        let input: GenerateDeploymentDiagramInput;
        try {
            input = validateInput(options.input);
            uri = resolveWorkspacePath(normalizeUmlPath(input.filePath), { requireUmlExtension: true });
        } catch (e) {
            return createToolResult(`Error: ${e instanceof Error ? e.message : String(e)}`);
        }

        const diagram = createEmptyDiagram();
        const nodesByName = new Map<string, UmlNode>();

        try {
            for (const entity of input.entities) {
                const node = addNode(diagram, entity.elementType, entity.name);
                nodesByName.set(entity.name, node);
            }

            for (const relationship of input.relationships ?? []) {
                addRelationship(diagram, nodesByName, relationship);
            }

            await vscode.workspace.fs.writeFile(uri, Buffer.from(stringifyUmlDiagramFile(diagram), 'utf-8'));
        } catch (e) {
            return createToolResult(`Error: ${e instanceof Error ? e.message : String(e)}`);
        }

        this.outputChannel.appendLine(
            `[big-ai] Generated deployment diagram: ${uri.fsPath} (${input.entities.length} entities, ${input.relationships?.length ?? 0} relationships)`
        );
        return createToolResult(`Generated UML deployment diagram at ${uri.fsPath}`);
    }
}

function validateInput(input: GenerateDeploymentDiagramInput): GenerateDeploymentDiagramInput {
    if (input.diagramType !== 'DEPLOYMENT') {
        throw new Error('diagramType must be DEPLOYMENT.');
    }
    validateRequiredString(input.filePath, 'filePath');
    if (!Array.isArray(input.entities) || input.entities.length === 0) {
        throw new Error('entities must contain at least one deployment diagram entity.');
    }
    const names = new Set<string>();
    for (const entity of input.entities) {
        entity.name = validateRequiredString(entity.name, 'entity.name');
        if (names.has(entity.name)) {
            throw new Error(`Duplicate entity "${entity.name}".`);
        }
        names.add(entity.name);
        if (!NODE_TYPES.has(entity.elementType)) {
            throw new Error(`Unsupported elementType "${String(entity.elementType)}".`);
        }
    }
    for (const relationship of input.relationships ?? []) {
        if (!RELATION_TYPES.has(relationship.relationType)) {
            throw new Error(`Unsupported relationType "${String(relationship.relationType)}".`);
        }
        relationship.sourceName = validateRequiredString(relationship.sourceName, 'relationship.sourceName');
        relationship.targetName = validateRequiredString(relationship.targetName, 'relationship.targetName');
    }
    return input;
}

function createEmptyDiagram(): UmlDiagramFile {
    return {
        diagram: {
            __type: 'DeploymentDiagram',
            __id: `diagram_${randomUUID()}`,
            diagramType: 'DEPLOYMENT',
            entities: [],
            relations: []
        },
        metaInfos: []
    };
}

function addNode(diagram: UmlDiagramFile, elementType: DeploymentNodeType, name: string): UmlNode {
    const id = `${elementType}_${randomUUID()}`;
    const node: UmlNode = {
        __type: elementType,
        __id: id,
        name,
        visibility: 'PUBLIC',
        ...elementDefaults(elementType)
    };
    diagram.diagram.entities.push(node);
    addDefaultBounds(diagram, id);
    return node;
}

function elementDefaults(elementType: DeploymentNodeType): Record<string, unknown> {
    switch (elementType) {
        case 'Artifact':
            return { properties: [], operations: [], nestedArtifacts: [] };
        case 'Device':
            return { nodes: [], executionEnvironments: [], deploymentSpecifications: [] };
        case 'ExecutionEnvironment':
            return { nestedEnvironments: [], artifacts: [], deploymentSpecifications: [] };
        case 'DeploymentNode':
            return { nestedNodes: [], deploymentSpecifications: [] };
        default:
            return {};
    }
}

function addRelationship(
    diagram: UmlDiagramFile,
    nodesByName: Map<string, UmlNode>,
    relationship: { relationType: DeploymentRelationType; sourceName: string; targetName: string }
): void {
    const source = nodesByName.get(relationship.sourceName);
    const target = nodesByName.get(relationship.targetName);
    if (!source) {
        throw new Error(`No source element named "${relationship.sourceName}" found for relationship.`);
    }
    if (!target) {
        throw new Error(`No target element named "${relationship.targetName}" found for relationship.`);
    }

    const relation: Record<string, unknown> = {
        __type: relationship.relationType,
        __id: `${relationship.relationType}_${randomUUID()}`,
        source: ref(source.__id),
        target: ref(target.__id),
        visibility: 'PUBLIC'
    };

    diagram.diagram.relations.push(relation);
}

function addDefaultBounds(diagram: UmlDiagramFile, id: string): void {
    const positionCount = diagram.metaInfos.filter(m => m.__type === 'Position').length;
    const col = positionCount % 4;
    const row = Math.floor(positionCount / 4);
    const x = 50 + col * 220;
    const y = 50 + row * 160;
    diagram.metaInfos.push(
        {
            __type: 'Size',
            __id: `size_${id}`,
            height: 30,
            width: 80,
            element: ref(id, 'ElementWithSizeAndPosition')
        },
        {
            __type: 'Position',
            __id: `pos_${id}`,
            x,
            y,
            element: ref(id, 'ElementWithSizeAndPosition')
        }
    );
}

function ref(nodeId: string, refType = 'Node') {
    return { __type: 'Reference', __refType: refType, __value: nodeId };
}

function normalizeUmlPath(filePath: string): string {
    const requestedPath = validateRequiredString(filePath, 'filePath');
    return requestedPath.toLowerCase().endsWith('.uml') ? requestedPath : `${requestedPath}.uml`;
}
