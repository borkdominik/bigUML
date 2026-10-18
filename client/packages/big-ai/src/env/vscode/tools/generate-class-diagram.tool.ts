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
    GenerateClassDiagramEntityInput,
    GenerateClassDiagramInput,
    GenerateClassDiagramRelationshipInput,
    UmlNodeType,
    UmlRelationType,
    UmlVisibility
} from '../../common/index.js';
import { buildRelationRecord } from './relation-serialization.js';
import {
    createToolResult,
    generateId,
    ref,
    resolveWorkspacePath,
    toParserSafeMultiplicity,
    toParserSafeName,
    validateRequiredString
} from './tool-utils.js';
import { stringifyUmlDiagramFile } from './uml-file-format.js';

interface UmlNode {
    __type: string;
    __id: string;
    name: string;
    properties?: UmlClassMember[];
    operations?: UmlClassMember[];
    [key: string]: unknown;
}

interface UmlClassMember {
    __type: 'Property' | 'Operation';
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
        __type: 'ClassDiagram';
        __id: string;
        diagramType: 'CLASS';
        entities: UmlNode[];
        relations: Record<string, unknown>[];
    };
    metaInfos: Record<string, unknown>[];
}

const NODE_TYPES = new Set<UmlNodeType>(['Class', 'AbstractClass', 'Interface', 'Enumeration', 'Package', 'DataType', 'PrimitiveType']);
const RELATION_TYPES = new Set<UmlRelationType>([
    'Association',
    'Aggregation',
    'Composition',
    'Abstraction',
    'Dependency',
    'Generalization',
    'InterfaceRealization',
    'PackageImport',
    'PackageMerge',
    'Realization',
    'Substitution',
    'Usage'
]);
const VISIBILITIES = new Set<UmlVisibility>(['PUBLIC', 'PRIVATE', 'PROTECTED', 'PACKAGE']);
const COMMON_PRIMITIVE_TYPES = new Set(['String', 'Date', 'Boolean', 'Integer', 'int', 'float', 'double', 'Number', 'Money']);
const BOUNDED_TYPES = new Set<UmlNodeType>(['Class', 'AbstractClass', 'Interface', 'Enumeration', 'Package', 'DataType', 'PrimitiveType']);
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
export class GenerateClassDiagramTool implements vscode.LanguageModelTool<GenerateClassDiagramInput> {
    constructor(@inject(OutputChannel) protected readonly outputChannel: OutputChannel) {}

    async invoke(
        options: vscode.LanguageModelToolInvocationOptions<GenerateClassDiagramInput>,
        token: vscode.CancellationToken
    ): Promise<vscode.LanguageModelToolResult> {
        void token;

        let uri: vscode.Uri;
        let input: GenerateClassDiagramInput;
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

            for (const entity of input.entities) {
                const owner = nodesByName.get(entity.name);
                if (!owner) {
                    throw new Error(`Internal error: missing node "${entity.name}".`);
                }
                for (const property of entity.properties ?? []) {
                    addProperty(diagram, nodesByName, owner, property);
                }
                for (const operation of entity.operations ?? []) {
                    addOperation(owner, operation.name, operation.visibility);
                }
                ensureOwnerHasVisibleMemberArea(diagram, owner);
            }

            for (const relationship of input.relationships ?? []) {
                addRelationship(diagram, nodesByName, relationship);
            }

            await vscode.workspace.fs.writeFile(uri, Buffer.from(stringifyUmlDiagramFile(diagram), 'utf-8'));
        } catch (e) {
            return createToolResult(`Error: ${e instanceof Error ? e.message : String(e)}`);
        }

        const declaredNames = new Set(input.entities.map(entity => toParserSafeName(entity.name)));
        const inferredClasses = diagram.diagram.entities
            .filter(node => node.__type === 'Class' && !declaredNames.has(node.name))
            .map(node => node.name);

        this.outputChannel.appendLine(
            `[big-ai] Generated class diagram: ${uri.fsPath} (${input.entities.length} entities, ${input.relationships?.length ?? 0} relationships)`
        );
        const baseMessage = `Generated UML class diagram at ${uri.fsPath}`;
        const message =
            inferredClasses.length === 0
                ? baseMessage
                : `${baseMessage}. Auto-created ${inferredClasses.length} undeclared ` +
                  `type${inferredClasses.length === 1 ? '' : 's'} referenced by a property: ${inferredClasses.join(', ')}.`;
        return createToolResult(message);
    }
}

function validateInput(input: GenerateClassDiagramInput): GenerateClassDiagramInput {
    if (input.diagramType !== 'CLASS') {
        throw new Error('diagramType must be CLASS.');
    }
    validateRequiredString(input.filePath, 'filePath');
    if (!Array.isArray(input.entities) || input.entities.length === 0) {
        throw new Error('entities must contain at least one class diagram entity.');
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
        validateMembers(entity);
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

function validateMembers(entity: GenerateClassDiagramEntityInput): void {
    for (const property of entity.properties ?? []) {
        validateRequiredString(property.name, `${entity.name}.properties.name`);
        if (property.visibility !== undefined && !VISIBILITIES.has(property.visibility)) {
            throw new Error(`Unsupported visibility "${String(property.visibility)}".`);
        }
    }
    for (const operation of entity.operations ?? []) {
        validateRequiredString(operation.name, `${entity.name}.operations.name`);
        if (operation.visibility !== undefined && !VISIBILITIES.has(operation.visibility)) {
            throw new Error(`Unsupported visibility "${String(operation.visibility)}".`);
        }
    }
}

function createEmptyDiagram(): UmlDiagramFile {
    return {
        diagram: {
            __type: 'ClassDiagram',
            __id: 'ClassDiagram1',
            diagramType: 'CLASS',
            entities: [],
            relations: []
        },
        metaInfos: []
    };
}

function addNode(diagram: UmlDiagramFile, entity: GenerateClassDiagramEntityInput): UmlNode {
    const id = generateId();
    const node = buildNode(entity.elementType, id, entity.name);
    diagram.diagram.entities.push(node);
    if (BOUNDED_TYPES.has(entity.elementType)) {
        addDefaultBounds(diagram, id);
    }
    return node;
}

function buildNode(elementType: UmlNodeType, id: string, name: string): UmlNode {
    const persistedType = elementType === 'AbstractClass' ? 'Class' : elementType;
    return { __type: persistedType, __id: id, ...elementDefaults(elementType), name: toParserSafeName(name) };
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

function addProperty(
    diagram: UmlDiagramFile,
    nodesByName: Map<string, UmlNode>,
    owner: UmlNode,
    property: NonNullable<GenerateClassDiagramEntityInput['properties']>[number]
): void {
    owner.properties ??= [];
    const member: UmlClassMember = {
        __type: 'Property',
        __id: generateId(),
        name: toParserSafeMemberName(toParserSafeName(validateRequiredString(property.name, 'property.name'))),
        isDerived: false,
        isOrdered: false,
        isStatic: false,
        isDerivedUnion: false,
        isReadOnly: false,
        isUnique: false,
        visibility: property.visibility ?? 'PUBLIC'
    };
    const multiplicity = property.multiplicity === undefined ? undefined : toParserSafeMultiplicity(property.multiplicity);
    if (multiplicity !== undefined) {
        member.multiplicity = multiplicity;
    }
    if (property.typeName !== undefined) {
        const typeName = validateRequiredString(property.typeName, 'property.typeName');
        const typeNode = findOrCreateTypeNode(diagram, nodesByName, typeName);
        member.propertyType = { __type: 'Reference', __refType: 'DataTypeReference', __value: typeNode.__id };
    }
    owner.properties.push(member);
}

function addOperation(owner: UmlNode, name: string, visibility: UmlVisibility | undefined): void {
    owner.operations ??= [];
    owner.operations.push({
        __type: 'Operation',
        __id: generateId(),
        name: toParserSafeMemberName(toParserSafeName(validateRequiredString(name, 'operation.name'))),
        visibility: visibility ?? 'PUBLIC',
        parameters: []
    });
}

function findOrCreateTypeNode(diagram: UmlDiagramFile, nodesByName: Map<string, UmlNode>, typeName: string): UmlNode {
    const existing = nodesByName.get(typeName);
    if (existing) {
        return existing;
    }
    const elementType: UmlNodeType = COMMON_PRIMITIVE_TYPES.has(typeName) ? 'PrimitiveType' : 'Class';
    const created = addNode(diagram, { name: typeName, elementType });
    nodesByName.set(typeName, created);
    return created;
}

function addRelationship(
    diagram: UmlDiagramFile,
    nodesByName: Map<string, UmlNode>,
    relationship: GenerateClassDiagramRelationshipInput
): void {
    const source = nodesByName.get(relationship.sourceName);
    const target = nodesByName.get(relationship.targetName);
    if (!source) {
        throw new Error(`No source element named "${relationship.sourceName}" found for relationship.`);
    }
    if (!target) {
        throw new Error(`No target element named "${relationship.targetName}" found for relationship.`);
    }

    const relation = buildRelationRecord({
        relationType: relationship.relationType,
        sourceId: source.__id,
        targetId: target.__id,
        name: relationship.name,
        sourceMultiplicity: relationship.sourceMultiplicity,
        targetMultiplicity: relationship.targetMultiplicity
    });

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

function ensureOwnerHasVisibleMemberArea(diagram: UmlDiagramFile, owner: UmlNode): void {
    const size = diagram.metaInfos.find(meta => meta.__type === 'Size' && getElementRefValue(meta) === owner.__id);
    if (!size) return;

    const propertyCount = owner.properties?.length ?? 0;
    const operationCount = owner.operations?.length ?? 0;
    const sectionCount = Number(propertyCount > 0) + Number(operationCount > 0);
    const requiredHeight = 30 + sectionCount * 18 + (propertyCount + operationCount) * 22;
    const requiredWidth = Math.max(120, estimateOwnerWidth(owner));

    size['height'] = Math.max(Number(size['height'] ?? 30), requiredHeight);
    size['width'] = Math.max(Number(size['width'] ?? 80), requiredWidth);
}

function getElementRefValue(meta: Record<string, unknown>): string | undefined {
    const element = meta['element'];
    return typeof element === 'object' && element !== null && '__value' in element ? String(element.__value) : undefined;
}

function estimateOwnerWidth(owner: UmlNode): number {
    const labels = [owner.name, ...(owner.properties?.map(memberLabel) ?? []), ...(owner.operations?.map(memberLabel) ?? [])];
    return Math.max(...labels.map(label => 40 + label.length * 8), 120);
}

function memberLabel(member: UmlClassMember): string {
    return member.__type === 'Operation' ? `${member.name}()` : member.name;
}

function normalizeUmlPath(filePath: string): string {
    const requestedPath = validateRequiredString(filePath, 'filePath');
    return requestedPath.toLowerCase().endsWith('.uml') ? requestedPath : `${requestedPath}.uml`;
}

function toParserSafeMemberName(value: string): string {
    if (!RESERVED_MEMBER_NAMES.has(value)) {
        return value;
    }
    return value === 'name' ? 'fullName' : `${value}Value`;
}
