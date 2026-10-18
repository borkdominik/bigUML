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
import type {
    ActivityNodeType,
    ActivityRelationType,
    GenerateActivityDiagramEntityInput,
    GenerateActivityDiagramInput,
    GenerateActivityDiagramRelationshipInput
} from '../../common/index.js';
import { createToolResult, generateId, ref, resolveWorkspacePath, validateRequiredString } from './tool-utils.js';
import { stringifyUmlDiagramFile } from './uml-file-format.js';

interface UmlNode {
    __type: ActivityNodeType;
    __id: string;
    name?: string;
    visibility?: 'PUBLIC' | 'PRIVATE' | 'PROTECTED' | 'PACKAGE';
    [key: string]: unknown;
}

interface UmlDiagramFile {
    diagram: {
        __type: 'ActivityDiagram';
        __id: string;
        diagramType: 'ACTIVITY';
        entities: UmlNode[];
        relations: Record<string, unknown>[];
    };
    metaInfos: Record<string, unknown>[];
}

const NODE_TYPES = new Set<ActivityNodeType>([
    'Activity',
    'ActivityPartition',
    'OpaqueAction',
    'AcceptEventAction',
    'SendSignalAction',
    'InitialNode',
    'DecisionNode',
    'MergeNode',
    'JoinNode',
    'ForkNode',
    'ActivityFinalNode',
    'FlowFinalNode',
    'CentralBufferNode',
    'ActivityParameterNode',
    'InputPin',
    'OutputPin'
]);
const RELATION_TYPES = new Set<ActivityRelationType>(['ControlFlow']);
const REQUIRED_NAME_TYPES = new Set<ActivityNodeType>([
    'Activity',
    'ActivityPartition',
    'OpaqueAction',
    'AcceptEventAction',
    'SendSignalAction',
    'CentralBufferNode',
    'ActivityParameterNode',
    'InputPin',
    'OutputPin'
]);

@injectable()
export class GenerateActivityDiagramTool implements vscode.LanguageModelTool<GenerateActivityDiagramInput> {
    constructor(@inject(OutputChannel) protected readonly outputChannel: OutputChannel) {}

    async invoke(
        options: vscode.LanguageModelToolInvocationOptions<GenerateActivityDiagramInput>,
        token: vscode.CancellationToken
    ): Promise<vscode.LanguageModelToolResult> {
        void token;

        let uri: vscode.Uri;
        let input: GenerateActivityDiagramInput;
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
                const node = addNode(diagram, entity);
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
            `[big-ai] Generated activity diagram: ${uri.fsPath} (${input.entities.length} entities, ${input.relationships?.length ?? 0} relationships)`
        );
        return createToolResult(`Generated UML activity diagram at ${uri.fsPath}`);
    }
}

function validateInput(input: GenerateActivityDiagramInput): GenerateActivityDiagramInput {
    if (input.diagramType !== 'ACTIVITY') {
        throw new Error('diagramType must be ACTIVITY.');
    }
    validateRequiredString(input.filePath, 'filePath');
    if (!Array.isArray(input.entities) || input.entities.length === 0) {
        throw new Error('entities must contain at least one activity diagram entity.');
    }

    const names = new Set<string>();
    for (const entity of input.entities) {
        entity.name = validateRequiredString(entity.name, 'entity.name');
        if (names.has(entity.name)) {
            throw new Error(`Duplicate entity "${entity.name}".`);
        }
        names.add(entity.name);
        if (!NODE_TYPES.has(entity.elementType)) {
            throw new Error(`Unsupported activity elementType "${String(entity.elementType)}".`);
        }
    }

    for (const relationship of input.relationships ?? []) {
        if (!RELATION_TYPES.has(relationship.relationType)) {
            throw new Error(`Unsupported activity relationType "${String(relationship.relationType)}".`);
        }
        relationship.sourceName = validateRequiredString(relationship.sourceName, 'relationship.sourceName');
        relationship.targetName = validateRequiredString(relationship.targetName, 'relationship.targetName');
        if (relationship.weight !== undefined && (!Number.isInteger(relationship.weight) || relationship.weight < 0)) {
            throw new Error('relationship.weight must be a non-negative integer.');
        }
    }

    return input;
}

function createEmptyDiagram(): UmlDiagramFile {
    return {
        diagram: {
            __type: 'ActivityDiagram',
            __id: generateId(),
            diagramType: 'ACTIVITY',
            entities: [],
            relations: []
        },
        metaInfos: []
    };
}

function addNode(diagram: UmlDiagramFile, entity: GenerateActivityDiagramEntityInput): UmlNode {
    const id = generateId();
    const node: UmlNode = {
        __type: entity.elementType,
        __id: id,
        visibility: 'PUBLIC',
        ...elementDefaults(entity.elementType)
    };
    if (REQUIRED_NAME_TYPES.has(entity.elementType) || entity.name.trim()) {
        node.name = toParserSafeIdentifier(entity.name);
    }
    diagram.diagram.entities.push(node);
    addDefaultBounds(diagram, id);
    return node;
}

function elementDefaults(elementType: ActivityNodeType): Record<string, unknown> {
    switch (elementType) {
        case 'Activity':
            return { partitions: [], nodes: [], edges: [] };
        case 'ActivityPartition':
            return { subpartitions: [], nodes: [] };
        case 'OpaqueAction':
            return { inputPins: [], outputPins: [] };
        default:
            return {};
    }
}

function addRelationship(
    diagram: UmlDiagramFile,
    nodesByName: Map<string, UmlNode>,
    relationship: GenerateActivityDiagramRelationshipInput
): void {
    const source = nodesByName.get(relationship.sourceName);
    const target = nodesByName.get(relationship.targetName);
    if (!source) {
        throw new Error(`No source element named "${relationship.sourceName}" found for control flow.`);
    }
    if (!target) {
        throw new Error(`No target element named "${relationship.targetName}" found for control flow.`);
    }

    const relation: Record<string, unknown> = {
        __type: relationship.relationType,
        __id: generateId(),
        source: ref(source.__id),
        target: ref(target.__id),
        visibility: 'PUBLIC'
    };

    if (relationship.name !== undefined) {
        relation['name'] = toParserSafeIdentifier(validateRequiredString(relationship.name, 'relationship.name'));
    }
    if (relationship.guard !== undefined) {
        relation['guard'] = toParserSafeIdentifier(validateRequiredString(relationship.guard, 'relationship.guard'));
    }
    if (relationship.weight !== undefined) {
        relation['weight'] = relationship.weight;
    }

    diagram.diagram.relations.push(relation);
}

function addDefaultBounds(diagram: UmlDiagramFile, id: string): void {
    const positionCount = diagram.metaInfos.filter(m => m.__type === 'Position').length;
    const col = positionCount % 4;
    const row = Math.floor(positionCount / 4);
    const x = 50 + col * 180;
    const y = 50 + row * 130;
    diagram.metaInfos.push(
        {
            __type: 'Size',
            __id: `size_${id}`,
            height: 50,
            width: 130,
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

function normalizeUmlPath(filePath: string): string {
    const requestedPath = validateRequiredString(filePath, 'filePath');
    return requestedPath.toLowerCase().endsWith('.uml') ? requestedPath : `${requestedPath}.uml`;
}

function toParserSafeIdentifier(value: string): string {
    const trimmed = value.trim();
    const normalized = trimmed.replace(/[^a-zA-Z0-9_-]+/g, '_').replace(/^[^a-zA-Z_]+/, '');
    return normalized || 'activityElement';
}
