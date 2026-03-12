/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import * as fs from 'fs/promises';
import * as path from 'path';
import type { Tree } from 'web-tree-sitter';
import * as treeSitter from 'web-tree-sitter';
import {
    type Diagram,
    type Node as DiagramNode,
    type Edge,
    type Multiplicity,
    type Operation,
    type Property
} from '../intermediate-model.js';

type ParsedProperty = {
    name: string;
    type: string;
    accessModifier: '+' | '-' | '#' | '';
    isCollection: boolean;
    resolvedTypes?: string[];
};

const isCollectionType = (typeNode: any): boolean => {
    const text = typeNode.text;
    return text.includes('List') || text.includes('Set') || text.includes('[]');
};

const createMultiplicity = (isCollectionType: boolean): Multiplicity => ({
    lower: isCollectionType ? 0 : 1,
    upper: isCollectionType ? '*' : 1
});

export class JavaUtils {
    private parser: treeSitter.Parser | null = null;
    language: string = 'Java';
    private fileMap = new Map<string, Tree>();
    private diagram: Diagram = { edges: [], nodes: [] };

    async doInit(uri: any): Promise<void> {
        await treeSitter.Parser.init();

        let javaWasmPath: string;
        // Try to use VSCode's joinPath if available, otherwise fallback to path.join
        if (uri && uri.fsPath) {
            try {
                // Dynamically import vscode if available
                const vscode = await import('vscode');
                javaWasmPath = vscode.Uri.joinPath(uri, 'wasm', 'tree-sitter-java.wasm').fsPath;
            } catch (e) {
                // Fallback for Node.js: use path.join
                javaWasmPath = path.join(uri.fsPath, 'wasm', 'tree-sitter-java.wasm');
            }
        } else {
            throw new Error('No extension URI provided for WASM path');
        }

        const java = await treeSitter.Language.load(javaWasmPath);
        const parser = new treeSitter.Parser();
        parser.setLanguage(java);
        this.parser = parser;
    }

    async countNumberOfJavaFiles(dirPath: string | null): Promise<number> {
        let count = 0;
        if (!dirPath) return 0;
        const entries = await fs.readdir(dirPath, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dirPath, entry.name);
            if (entry.isDirectory()) {
                count += await this.countNumberOfJavaFiles(fullPath);
            } else if (entry.isFile() && entry.name.endsWith('.java')) {
                count++;
            }
        }

        return count;
    }

    async createNode(name: string, tree: Tree): Promise<DiagramNode> {
        const c: DiagramNode = {
            name: name,
            id: await this.createNodeId(name, tree),
            type: await this.getNodeType(tree),
            properties: await this.getProperties(tree),
            operations: await this.getMethods(tree),
            enumerationLiterals: await this.getEnumLiterals(tree),
            comment: await this.getNodeComment(tree)
        };

        return c;
    }

    async getNodeComment(tree: Tree): Promise<DiagramNode['comment']> {
        const commentNode = tree.rootNode.descendantsOfType('block_comment')[0];
        if (commentNode) return commentNode.text;
        return '';
    }

    async getNodeType(tree: Tree): Promise<DiagramNode['type']> {
        const classNode = tree.rootNode.descendantsOfType('class_declaration')[0];

        if (classNode) {
            const modifiersNode = classNode.descendantsOfType('modifiers');
            if (modifiersNode) {
                for (const modifier of modifiersNode) {
                    const modifierTexts = modifier?.text;
                    if (modifierTexts?.includes('abstract')) {
                        return 'AbstractClass';
                    }
                }
            }
            return 'Class';
        }

        const interfaceNode = tree.rootNode.descendantsOfType('interface_declaration')[0];
        if (interfaceNode) {
            return 'Interface';
        }

        const enumNode = tree.rootNode.descendantsOfType('enum_declaration')[0];
        if (enumNode) {
            return 'Enumeration';
        }

        return 'Class';
    }

    async readJavaFilesAsMap(dirPath: string | null): Promise<Map<string, Tree>> {
        this.diagram.edges = [];

        const readDirRecursive = async (currentPath: string | null) => {
            if (!currentPath) return;
            const entries = await fs.readdir(currentPath, { withFileTypes: true });

            for (const entry of entries) {
                const fullPath = path.join(currentPath, entry.name);
                if (entry.isDirectory()) {
                    await readDirRecursive(fullPath);
                } else if (entry.isFile() && entry.name.endsWith('.java')) {
                    try {
                        const content = await fs.readFile(fullPath, 'utf-8');
                        const parsedContent = this.parser?.parse(content);
                        if (parsedContent) {
                            this.fileMap.set(entry.name.replace(/\.java$/, ''), parsedContent);
                        }
                    } catch (err) {
                        console.error(`Failed to read file ${fullPath}:`, err);
                    }
                }
            }
        };

        await readDirRecursive(dirPath);
        return this.fileMap;
    }

    async getEnumLiterals(tree: Tree | null): Promise<string[]> {
        if (!tree) return [];
        const enumLiterals: string[] = [];
        const enumNode = tree.rootNode.descendantsOfType('enum_declaration')[0];
        if (enumNode) {
            const bodies = enumNode.descendantsOfType('enum_body');
            for (const body of bodies) {
                if (!body) continue;
                const enumConstants = body.descendantsOfType('enum_constant');
                for (const enumConstant of enumConstants) {
                    if (!enumConstant) continue;
                    const constantName = enumConstant.childForFieldName('name');
                    if (constantName) {
                        enumLiterals.push(constantName.text);
                    }
                }
            }
        }
        return enumLiterals;
    }

    async getProperties(tree: Tree | null): Promise<Property[]> {
        if (!tree) return [];
        const parsedProperties = await this.parseProperties(tree);

        return parsedProperties.map(prop => ({
            name: prop.name,
            type: prop.type,
            accessModifier: prop.accessModifier
        }));
    }

    private async parseProperties(tree: Tree): Promise<ParsedProperty[]> {
        console.log('Method call: parseProperties');

        const properties: ParsedProperty[] = [];

        const classNode =
            tree.rootNode.descendantsOfType('class_declaration')[0] ?? tree.rootNode.descendantsOfType('interface_declaration')[0];

        if (!classNode) return properties;

        const fieldNodes = classNode.descendantsOfType('field_declaration');
        for (const fieldNode of fieldNodes) {
            if (!fieldNode) continue;
            const modifiersNode = fieldNode.descendantsOfType('modifiers');
            const nodeType = fieldNode.childForFieldName('type');

            const varDeclarator = fieldNode.descendantsOfType('variable_declarator')[0];
            const nodeName = varDeclarator?.childForFieldName('name');

            let accessModifier: Property['accessModifier'] = '';

            if (!modifiersNode) continue;
            for (const modifier of modifiersNode) {
                const modifierText = modifier?.text;

                if (modifierText?.includes('public')) accessModifier = '+';
                else if (modifierText?.includes('private')) accessModifier = '-';
                else if (modifierText?.includes('protected')) accessModifier = '#';
            }

            const resolvedTypes = this.extractResolvedTypes(nodeType);

            if (nodeName && nodeType) {
                const isCollection = isCollectionType(nodeType);

                properties.push({
                    name: nodeName.text,
                    type: nodeType.text,
                    accessModifier,
                    isCollection,
                    resolvedTypes
                });
            }
        }

        return properties;
    }

    async getMethods(tree: Tree | null): Promise<Operation[]> {
        if (!tree) return [];
        const methods: Operation[] = [];
        const rootNode = tree.rootNode;

        const methodNodes = rootNode.descendantsOfType('method_declaration');

        for (const methodNode of methodNodes) {
            if (!methodNode) continue;

            const nameNode = methodNode.childForFieldName('name');
            const modifiersNode = methodNode.descendantsOfType('modifiers');
            const typeNode = methodNode.childForFieldName('type');
            const paramsNode = methodNode.childForFieldName('parameters');
            let accessModifier: Operation['accessModifier'] = ''; // fallback

            if (!modifiersNode) continue;
            for (const modifier of modifiersNode) {
                const modifierTexts = modifier?.text;
                if (modifierTexts?.includes('public')) {
                    accessModifier = '+';
                } else if (modifierTexts?.includes('private')) {
                    accessModifier = '-';
                } else if (modifierTexts?.includes('protected')) {
                    accessModifier = '#';
                }
            }

            const parameters: { name: string; type: string }[] = [];

            if (paramsNode) {
                const paramNodes = paramsNode.namedChildren.filter(n => n?.type === 'formal_parameter');

                for (const param of paramNodes) {
                    if (!param) continue;
                    const typeNode = param.childForFieldName('type');
                    const nameNode = param.childForFieldName('name');
                    if (typeNode && nameNode) {
                        parameters.push({
                            type: typeNode.text,
                            name: nameNode.text
                        });
                    }
                }
            }

            if (nameNode && typeNode) {
                methods.push({
                    name: nameNode.text,
                    accessModifier,
                    type: typeNode.text,
                    attributes: parameters
                });
            }
        }

        return methods;
    }

    async createNodeId(className: string, tree: Tree | null): Promise<string> {
        const packageName = await this.getPackageName(tree);

        return packageName + '.' + className;
    }

    async getPackageName(tree: Tree | null): Promise<string> {
        if (!tree) return crypto.randomUUID.toString();

        const packageNode = tree.rootNode.descendantsOfType('package_declaration')[0];

        if (!packageNode) return crypto.randomUUID.toString();

        const identifierNode = packageNode.descendantsOfType('scoped_identifier')[0];
        console.log('Package name:', identifierNode?.text ?? crypto.randomUUID());
        return identifierNode?.text ?? crypto.randomUUID();
    }

    async createEdges(source: DiagramNode, sourceTree: Tree, typeToId: Map<string, string>): Promise<Edge[]> {
        console.log('Creating edges');

        const edges: Edge[] = [];

        const parsedProperties = await this.parseProperties(sourceTree);
        console.log('Parsed properties:', parsedProperties);

        for (const property of parsedProperties) {
            console.log('Processing property: ', property);

            for (const resolvedType of property.resolvedTypes ?? []) {
                console.log('Resolved type:', resolvedType);

                const targetId = typeToId.get(resolvedType);
                console.log('Target ID for property:', targetId);

                if (!targetId || targetId === source.id) continue;

                const sourceMultiplicity = createMultiplicity(false);
                const targetMultiplicity = createMultiplicity(property.isCollection);

                // Default is association
                let relationshipType: 'Association' | 'Aggregation' | 'Composition' = 'Association';

                const isPrivateOrProtected = property.accessModifier === '-' || property.accessModifier === '#';
                const isPassedAsMethodParameter = this.isPassedAsParameter(sourceTree, property.resolvedTypes ?? []);

                // Check for Composition
                if (isPrivateOrProtected && !isPassedAsMethodParameter) {
                    relationshipType = 'Composition';
                }
                // Check for Aggregation
                else if (isPrivateOrProtected && isPassedAsMethodParameter) {
                    relationshipType = 'Aggregation';
                }

                edges.push({
                    type: relationshipType,
                    fromId: source.id,
                    toId: targetId,
                    label: property.name,
                    sourceMultiplicity: sourceMultiplicity,
                    targetMultiplicity: targetMultiplicity
                });
            }
        }

        // Check for generalization (superclass)
        const classNode = sourceTree.rootNode.descendantsOfType('class_declaration')[0];
        const superclassNode = classNode?.descendantsOfType('superclass')[0];
        const typeIdentifier = superclassNode?.descendantsOfType('type_identifier')[0];
        const superClassName = typeIdentifier?.text;

        if (superClassName) {
            const targetId = typeToId.get(superClassName);

            if (targetId && targetId !== source.id) {
                edges.push({
                    type: 'Generalization',
                    fromId: source.id,
                    toId: targetId,
                    label: ''
                });
            }
        }

        // Check for realization (interfaces)
        const interfaceIdentifiers = classNode?.descendantsOfType('super_interfaces')[0]?.descendantsOfType('type_identifier') ?? [];

        for (const interfaceNode of interfaceIdentifiers) {
            const interfaceName = interfaceNode?.text;
            if (interfaceName) {
                const targetId = typeToId.get(interfaceName);

                if (targetId && targetId !== source.id) {
                    edges.push({
                        type: 'Realization',
                        fromId: source.id,
                        toId: targetId,
                        label: ''
                    });
                }
            }
        }

        return edges;
    }

    private isPassedAsParameter(tree: Tree, resolvedTypes: string[]): boolean {
        const isPassesAsParameterInMethod = tree.rootNode.descendantsOfType('method_declaration').some(method => {
            const params = method?.childForFieldName('parameters')?.namedChildren ?? [];
            return params.some(param => {
                const paramTypeNode = param?.childForFieldName('type');
                const resolvedParamTypes = this.extractResolvedTypes(paramTypeNode);
                return resolvedParamTypes.some(type => resolvedTypes.includes(type));
            });
        });

        const isPassesAsParameterInConstructor = tree.rootNode.descendantsOfType('constructor_declaration').some(method => {
            const params = method?.childForFieldName('parameters')?.namedChildren ?? [];
            return params.some(param => {
                const paramTypeNode = param?.childForFieldName('type');
                const resolvedParamTypes = this.extractResolvedTypes(paramTypeNode);
                return resolvedParamTypes.some(type => resolvedTypes.includes(type));
            });
        });

        return isPassesAsParameterInMethod || isPassesAsParameterInConstructor;
    }

    private extractResolvedTypes(typeNode: any): string[] {
        const resolvedTypes: string[] = [];

        if (!typeNode) return resolvedTypes;

        const typeArgsNodes = typeNode.descendantsOfType('type_arguments');
        if (typeArgsNodes.length > 0) {
            const typeIdentifiers = typeArgsNodes[0]?.descendantsOfType('type_identifier') ?? [];
            for (const id of typeIdentifiers) {
                if (id) resolvedTypes.push(id.text);
            }
        } else {
            resolvedTypes.push(typeNode.text);
        }

        return resolvedTypes;
    }
}
