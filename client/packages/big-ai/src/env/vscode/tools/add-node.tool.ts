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
import type { AddNodeInput, UmlNodeType } from '../../common/index.js';
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

// Element types that have a visual position/size in the diagram
const BOUNDED_TYPES = new Set<UmlNodeType>(['Class', 'AbstractClass', 'Interface', 'Enumeration', 'Package', 'DataType', 'PrimitiveType']);

// Mapping from UmlNodeType to GLSP element type IDs
const NODE_TYPE_ID: Record<UmlNodeType, string> = {
    Class: 'class__Class',
    AbstractClass: 'class__AbstractClass',
    Interface: 'class__Interface',
    Enumeration: 'class__Enumeration',
    Package: 'class__Package',
    DataType: 'class__DataType',
    PrimitiveType: 'class__PrimitiveType'
};

@injectable()
export class AddNodeTool implements vscode.LanguageModelTool<AddNodeInput> {
    constructor(@inject(OutputChannel) protected readonly outputChannel: OutputChannel) {}

    async invoke(
        options: vscode.LanguageModelToolInvocationOptions<AddNodeInput>,
        token: vscode.CancellationToken
    ): Promise<vscode.LanguageModelToolResult> {
        void token;

        const { filePath, elementType, name, properties } = options.input;
        this.outputChannel.appendLine(`[big-ai] AddNodeTool: ${elementType} "${name}" -> ${filePath}`);

        let elementName: string;
        let uri: vscode.Uri;
        try {
            elementName = validateRequiredString(name, 'name');
            if (!Object.prototype.hasOwnProperty.call(NODE_TYPE_ID, elementType)) {
                throw new Error(`Unsupported elementType "${String(elementType)}".`);
            }
            if (properties !== undefined && (typeof properties !== 'object' || properties === null || Array.isArray(properties))) {
                throw new Error('properties must be an object when provided.');
            }
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

        const existing = diagram.diagram.entities.find(e => e.name === elementName);
        if (existing) {
            if (existing.__type === elementType) {
                return createToolResult(`${elementType} "${elementName}" already exists in ${filePath}`);
            }
            if (elementType === 'AbstractClass' && existing.__type === 'Class' && existing['isAbstract'] === true) {
                return createToolResult(`${elementType} "${elementName}" already exists in ${filePath}`);
            }
            return createToolResult(`Error: An element named "${elementName}" already exists in the diagram.`);
        }

        // Compute position for the new node
        const positionCount = diagram.metaInfos.filter(m => m.__type === 'Position').length;
        const col = positionCount % 4;
        const row = Math.floor(positionCount / 4);
        const x = 50 + col * 220;
        const y = 50 + row * 160;

        // Write directly to the file with deterministic ids. (The live GLSP createNode operation was used
        // here before, but it persisted layout entries whose element reference was "undefined", which then
        // crashed every later edit when the file was re-serialized. The participant refreshes the open
        // diagram after the edit batch instead.)
        const id = generateId();
        const node = buildNode(elementType, id, elementName, properties);
        diagram.diagram.entities.push(node);

        if (BOUNDED_TYPES.has(elementType)) {
            diagram.metaInfos.push(
                {
                    __type: 'Size',
                    __id: `size_${id}`,
                    height: 30,
                    width: 80,
                    element: { __type: 'Reference', __refType: 'ElementWithSizeAndPosition', __value: id }
                },
                {
                    __type: 'Position',
                    __id: `pos_${id}`,
                    x,
                    y,
                    element: { __type: 'Reference', __refType: 'ElementWithSizeAndPosition', __value: id }
                }
            );
        }

        await vscode.workspace.fs.writeFile(uri, Buffer.from(stringifyUmlDiagramFile(diagram), 'utf-8'));

        this.outputChannel.appendLine(`[big-ai] Added ${elementType} "${elementName}" (id: ${id}) via file write`);
        return createToolResult(`Added ${elementType} "${elementName}" (id: ${id}) to ${filePath}`);
    }
}

function generateId(): string {
    const uuid = randomUUID();
    return `a${uuid.substring(1)}`;
}

function buildNode(elementType: UmlNodeType, id: string, name: string, extra?: Record<string, unknown>): UmlNode {
    const persistedType = elementType === 'AbstractClass' ? 'Class' : elementType;
    const defaults = elementDefaults(elementType);
    return { __type: persistedType, __id: id, ...defaults, name, ...extra };
}

function elementDefaults(elementType: UmlNodeType): Record<string, unknown> {
    switch (elementType) {
        case 'Class':
            return { isAbstract: false, properties: [], operations: [], isActive: false, visibility: 'PUBLIC', skip: false };
        case 'AbstractClass':
            return { isAbstract: true, properties: [], operations: [], isActive: false, visibility: 'PUBLIC', skip: false };
        case 'Interface':
            return { properties: [], operations: [] };
        case 'Enumeration':
            return { values: [] };
        case 'Package':
            return { visibility: 'PUBLIC', entities: [] };
        case 'DataType':
            return { properties: [], operations: [], isAbstract: false, visibility: 'PUBLIC' };
        case 'PrimitiveType':
            return {};
    }
}
