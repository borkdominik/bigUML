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
import type { AddClassMemberInput, UmlClassMemberKind, UmlVisibility } from '../../common/index.js';
import {
    createToolResult,
    generateId,
    resolveWorkspacePath,
    toParserSafeMultiplicity,
    toParserSafeName,
    validateRequiredString,
    validateUmlDiagramFile
} from './tool-utils.js';
import { stringifyUmlDiagramFile } from './uml-file-format.js';

interface UmlNode {
    __id: string;
    __type: string;
    name: string;
    properties?: UmlClassMember[];
    operations?: UmlClassMember[];
    [key: string]: unknown;
}

interface UmlClassMember {
    __type: UmlClassMemberKind;
    __id: string;
    name: string;
    visibility?: UmlVisibility;
    multiplicity?: string;
    propertyType?: {
        __type: 'Reference';
        __refType: 'DataTypeReference';
        __value: string;
    };
    parameters?: unknown[];
    [key: string]: unknown;
}

interface UmlDiagramFile {
    diagram: {
        entities: UmlNode[];
        relations: unknown[];
    };
    metaInfos: UmlMetaInfo[];
}

interface UmlMetaInfo {
    __type: string;
    __id: string;
    height?: number;
    width?: number;
    element?: {
        __type: 'Reference';
        __refType: string;
        __value: string;
    };
    [key: string]: unknown;
}

const OWNERS_WITH_MEMBERS = new Set(['Class', 'AbstractClass', 'Interface', 'DataType']);
const MEMBER_KINDS = new Set<UmlClassMemberKind>(['Property', 'Operation']);
const VISIBILITIES = new Set<UmlVisibility>(['PUBLIC', 'PRIVATE', 'PROTECTED', 'PACKAGE']);
const COMMON_PRIMITIVE_TYPES = new Set(['String', 'Date', 'Boolean', 'Integer', 'int', 'float', 'double', 'Number', 'Money']);
const RESERVED_MEMBER_NAMES = new Set([
    '__type',
    '__id',
    '__refType',
    '__value',
    'aggregation',
    'diagram',
    'diagramType',
    'element',
    'entities',
    'height',
    'isAbstract',
    'isActive',
    'isDerived',
    'isDerivedUnion',
    'isOrdered',
    'isReadOnly',
    'isStatic',
    'isUnique',
    'metaInfos',
    'multiplicity',
    'name',
    'operations',
    'parameters',
    'properties',
    'propertyType',
    'relations',
    'skip',
    'source',
    'target',
    'visibility',
    'width',
    'x',
    'y'
]);

@injectable()
export class AddClassMemberTool implements vscode.LanguageModelTool<AddClassMemberInput> {
    constructor(@inject(OutputChannel) protected readonly outputChannel: OutputChannel) {}

    async invoke(
        options: vscode.LanguageModelToolInvocationOptions<AddClassMemberInput>,
        token: vscode.CancellationToken
    ): Promise<vscode.LanguageModelToolResult> {
        void token;

        const { filePath, ownerName, memberKind, name, typeName, multiplicity, visibility } = options.input;
        this.outputChannel.appendLine(`[big-ai] AddClassMemberTool: ${memberKind} "${name}" -> "${ownerName}" in ${filePath}`);

        let ownerElementName: string;
        let memberName: string;
        let uri: vscode.Uri;
        try {
            ownerElementName = validateRequiredString(ownerName, 'ownerName');
            memberName = toParserSafeMemberName(toParserSafeName(validateRequiredString(name, 'name')));
            if (!MEMBER_KINDS.has(memberKind)) {
                throw new Error(`Unsupported memberKind "${String(memberKind)}".`);
            }
            if (typeName !== undefined) validateRequiredString(typeName, 'typeName');
            if (multiplicity !== undefined) validateRequiredString(multiplicity, 'multiplicity');
            if (visibility !== undefined && !VISIBILITIES.has(visibility)) {
                throw new Error(`Unsupported visibility "${String(visibility)}".`);
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

        const owner = diagram.diagram.entities.find(e => e.name === ownerElementName);
        if (!owner) {
            return createToolResult(`Error: No element named "${ownerElementName}" found in ${filePath}`);
        }
        if (!OWNERS_WITH_MEMBERS.has(owner.__type)) {
            return createToolResult(`Error: ${owner.__type} "${ownerElementName}" cannot contain properties or operations.`);
        }

        const collectionName = memberKind === 'Property' ? 'properties' : 'operations';
        owner[collectionName] ??= [];
        const collection = owner[collectionName];
        if (!Array.isArray(collection)) {
            return createToolResult(`Error: ${ownerElementName}.${collectionName} is not an array.`);
        }

        if (collection.some(member => isNamedMember(member, memberName))) {
            return createToolResult(`Error: ${ownerElementName} already has a ${memberKind} named "${memberName}".`);
        }

        const safeMultiplicity = multiplicity === undefined ? undefined : toParserSafeMultiplicity(multiplicity);
        const member = buildClassMember(memberKind, memberName, visibility, safeMultiplicity);
        if (memberKind === 'Property' && typeName !== undefined) {
            const type = findOrCreatePrimitiveType(diagram, typeName);
            if (!type) {
                return createToolResult(`Error: No type named "${typeName}" found in ${filePath}`);
            }
            member.propertyType = {
                __type: 'Reference',
                __refType: 'DataTypeReference',
                __value: type.__id
            };
        }

        collection.push(member);
        ensureOwnerHasVisibleMemberArea(diagram, owner);
        await vscode.workspace.fs.writeFile(uri, Buffer.from(stringifyUmlDiagramFile(diagram), 'utf-8'));

        this.outputChannel.appendLine(`[big-ai] Added ${memberKind} "${memberName}" to "${ownerElementName}"`);
        return createToolResult(`Added ${memberKind} "${memberName}" to "${ownerElementName}" in ${filePath}`);
    }
}

function buildClassMember(
    memberKind: UmlClassMemberKind,
    name: string,
    visibility: UmlVisibility | undefined,
    multiplicity: string | undefined
): UmlClassMember {
    const base = {
        __type: memberKind,
        __id: generateId(),
        name,
        visibility: visibility ?? 'PUBLIC'
    };

    if (memberKind === 'Operation') {
        return {
            ...base,
            parameters: []
        };
    }

    return {
        ...base,
        isDerived: false,
        isOrdered: false,
        isStatic: false,
        isDerivedUnion: false,
        isReadOnly: false,
        isUnique: false,
        ...(multiplicity !== undefined ? { multiplicity } : {})
    };
}

function isNamedMember(value: unknown, name: string): boolean {
    return typeof value === 'object' && value !== null && 'name' in value && value.name === name;
}

function ensureOwnerHasVisibleMemberArea(diagram: UmlDiagramFile, owner: UmlNode): void {
    const size = diagram.metaInfos.find(meta => meta.__type === 'Size' && meta.element?.__value === owner.__id);
    if (!size) {
        return;
    }

    const propertyCount = Array.isArray(owner.properties) ? owner.properties.length : 0;
    const operationCount = Array.isArray(owner.operations) ? owner.operations.length : 0;
    const sectionCount = Number(propertyCount > 0) + Number(operationCount > 0);
    const requiredHeight = 30 + sectionCount * 18 + (propertyCount + operationCount) * 22;
    const requiredWidth = Math.max(120, estimateOwnerWidth(owner));

    size.height = Math.max(size.height ?? 30, requiredHeight);
    size.width = Math.max(size.width ?? 80, requiredWidth);
}

function findOrCreatePrimitiveType(diagram: UmlDiagramFile, typeName: string): UmlNode | undefined {
    const existing = diagram.diagram.entities.find(e => e.name === typeName);
    if (existing || !COMMON_PRIMITIVE_TYPES.has(typeName)) {
        return existing;
    }

    const id = generateId();
    const primitiveType: UmlNode = {
        __type: 'PrimitiveType',
        __id: id,
        name: typeName
    };
    diagram.diagram.entities.push(primitiveType);
    addDefaultBounds(diagram, id);
    return primitiveType;
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

function estimateOwnerWidth(owner: UmlNode): number {
    const labels = [
        owner.name,
        ...(Array.isArray(owner.properties) ? owner.properties.map(memberLabel) : []),
        ...(Array.isArray(owner.operations) ? owner.operations.map(memberLabel) : [])
    ];
    return Math.max(...labels.map(label => 40 + label.length * 8), 120);
}

function memberLabel(member: UmlClassMember): string {
    return member.__type === 'Operation' ? `${member.name}()` : member.name;
}

function toParserSafeMemberName(value: string): string {
    if (!RESERVED_MEMBER_NAMES.has(value)) {
        return value;
    }
    return value === 'name' ? 'fullName' : `${value}Value`;
}
