/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import {
    EXPERIMENTAL_TYPES,
    TYPES,
    type ActionDispatcher,
    type ActionListener,
    type Disposable,
    type ExperimentalGLSPServerModelState
} from '@borkdominik-biguml/big-vscode-integration/vscode';
import { DisposableCollection } from '@eclipse-glsp/protocol';
import { inject, injectable, postConstruct } from 'inversify';
import * as vscode from 'vscode';
import type { Tree } from 'web-tree-sitter';

import {
    BatchCreateOperation,
    UpdateElementPropertyAction,
    type BatchOperation,
    type TempCreationId
} from '@borkdominik-biguml/uml-protocol';
import { CreateEdgeOperation, CreateNodeOperation } from '@eclipse-glsp/protocol';
import { v4 } from 'uuid';

import {
    ChangeLanguageResponseAction,
    GenerateDiagramRequestAction,
    GenerateDiagramResponseAction,
    RequestChangeLanguageAction,
    RequestSelectFolderAction,
    SelectedFolderResponseAction
} from '../common/code-to-class-diagram.action.js';
import { type Diagram, type Node as DiagramNode, type Edge, type Node, type Operation, type Property } from './intermediate-model.js';
import { JavaUtils } from './java/JavaUtils.js';

// Handle the action within the server and not the glsp client / server
@injectable()
export class CodeToClassDiagramActionHandler implements Disposable {
    @inject(TYPES.ActionDispatcher)
    protected readonly actionDispatcher: ActionDispatcher;
    @inject(TYPES.ActionListener)
    protected readonly actionListener: ActionListener;
    @inject(EXPERIMENTAL_TYPES.GLSPServerModelState)
    protected readonly modelState: ExperimentalGLSPServerModelState;
    @inject(TYPES.ExtensionContext)
    protected readonly extensionContext: vscode.ExtensionContext;

    private javaUtils = new JavaUtils();

    private readonly toDispose = new DisposableCollection();
    private path: string | null = null;
    private fileMap = new Map<string, Tree>();
    private fileCount = 0;
    private diagram: Diagram = { edges: [], nodes: [] };
    language: string = 'Java';

    @postConstruct()
    protected init(): void {
        this.toDispose.push(
            this.actionListener.handleVSCodeRequest<RequestSelectFolderAction>(RequestSelectFolderAction.KIND, async () => {
                console.log('RequestSelectFolderAction');

                //EXT-LANGUAGE-TODO
                if (this.language === 'Java') {
                    await this.javaUtils.doInit(this.extensionContext.extensionUri);
                }

                const folders = await vscode.window.showOpenDialog({
                    canSelectFolders: true,
                    canSelectMany: false,
                    openLabel: 'Select Folder'
                });

                const folderPath = folders?.[0]?.fsPath ?? null;
                console.log('Selected Folder:', folderPath);
                this.path = folderPath;
                this.fileCount = 0;

                //EXT-LANGUAGE-TODO
                if (this.language === 'Java' && folderPath !== null) {
                    this.fileCount = await this.javaUtils.countNumberOfJavaFiles(folderPath);
                    console.log(`Found ${this.fileCount} .java files in ${folderPath}`);
                }

                return SelectedFolderResponseAction.create({
                    folderPath: folderPath,
                    fileCount: this.fileCount
                });
            })
        );

        this.toDispose.push(
            this.actionListener.handleVSCodeRequest<RequestChangeLanguageAction>(RequestChangeLanguageAction.KIND, async message => {
                console.log('RequestChangeLanguageAction - Selected Language:', message.action.language);
                this.fileCount = 0;
                if (message.action.language != null) this.language = message.action.language;

                //EXT-LANGUAGE-TODO
                if (this.language === 'Java' && this.path !== null) {
                    this.fileCount = await this.javaUtils.countNumberOfJavaFiles(this.path);
                    console.log(`Found ${this.fileCount} .java files in ${this.path}`);
                }
                return ChangeLanguageResponseAction.create({
                    fileCount: this.fileCount
                });
            })
        );

        this.toDispose.push(
            this.actionListener.handleVSCodeRequest<GenerateDiagramRequestAction>(GenerateDiagramRequestAction.KIND, async () => {
                this.diagram = { edges: [], nodes: [] };
                this.fileMap = await this.readClassesAsMap(this.path);

                // Create Nodes
                const nodes = await Promise.all(
                    Array.from(this.fileMap.entries()).map(async ([key, value]) => {
                        return this.createNode(key, value);
                    })
                );

                // Assign after all async work is done
                this.diagram.nodes.push(...nodes);

                // Create Edges
                const nodeNameToIdMap = new Map<string, string>();

                for (const node of this.diagram.nodes) {
                    nodeNameToIdMap.set(node.name, node.id);
                }

                const edgesArrays = await Promise.all(
                    Array.from(this.diagram.nodes).map(node => {
                        const tree = this.fileMap.get(node.name);
                        return tree ? this.createEdges(node, tree, nodeNameToIdMap) : Promise.resolve([]);
                    })
                );

                const edges = edgesArrays.flat();
                this.diagram.edges.push(...edges);

                console.log('Generated Diagram:', this.diagram);

                this.createDiagram(this.diagram);

                return GenerateDiagramResponseAction.create();
            })
        );
    }

    async readClassesAsMap(dirPath: string | null): Promise<Map<string, Tree>> {
        //EXT-LANGUAGE-TODO
        if (this.language === 'Java') {
            return await this.javaUtils.readJavaFilesAsMap(dirPath);
        }
        return new Map<string, Tree>();
    }

    async createEdges(source: DiagramNode, sourceTree: Tree, typeToId: Map<string, string>): Promise<Edge[]> {
        //EXT-LANGUAGE-TODO
        if (this.language === 'Java') {
            return await this.javaUtils.createEdges(source, sourceTree, typeToId);
        }

        return [];
    }

    dispose(): void {
        this.toDispose.dispose();
    }

    async createNode(name: string, tree: Tree): Promise<DiagramNode> {
        let c: DiagramNode = {
            id: '',
            name: '',
            type: 'AbstractClass',
            properties: [],
            operations: [],
            enumerationLiterals: [],
            comment: ''
        };

        //EXT-LANGUAGE-TODO
        if (this.language === 'Java') {
            c = await this.javaUtils.createNode(name, tree);
        }

        return c;
    }

    createDiagram(diagram: Diagram): void {
        const operations: BatchOperation[] = [];

        function handleNode(node: Node, containerId?: string): BatchOperation {
            const tempId: TempCreationId = `temp_${node.id}`;

            const createOperation = CreateNodeOperation.create(`CLASS__${node.type}`, { containerId });
            const updateActions: UpdateElementPropertyAction[] = [];

            if (node.name) {
                updateActions.push(
                    UpdateElementPropertyAction.create({
                        elementId: tempId,
                        propertyId: 'name',
                        value: node.name
                    })
                );
            }

            return {
                tempCreationId: tempId,
                createOperation,
                updateActions
            };
        }

        function handleProperty(node: Node, property: Property): BatchOperation {
            const tempId: TempCreationId = `temp_${v4()}`;

            const createOperation = CreateNodeOperation.create(`CLASS__Property`, { containerId: `temp_${node.id}` });
            const updateActions: UpdateElementPropertyAction[] = [];

            if (property.name) {
                updateActions.push(
                    UpdateElementPropertyAction.create({
                        elementId: tempId,
                        propertyId: 'name',
                        value: property.name
                    })
                );
            }

            return {
                tempCreationId: tempId,
                createOperation,
                updateActions
            };
        }

        function handleOperation(node: Node, operation: Operation): BatchOperation {
            const tempId: TempCreationId = `temp_${v4()}`;

            const createOperation = CreateNodeOperation.create(`CLASS__Operation`, { containerId: `temp_${node.id}` });
            const updateActions: UpdateElementPropertyAction[] = [];

            if (operation.name) {
                updateActions.push(
                    UpdateElementPropertyAction.create({
                        elementId: tempId,
                        propertyId: 'name',
                        value: operation.name
                    })
                );
            }

            return {
                tempCreationId: tempId,
                createOperation,
                updateActions
            };
        }

        function handleEdge(edge: Edge): BatchOperation {
            const tempId: TempCreationId = `temp_${v4()}`;

            let createOperation = null;
            console.log('Handling edge:', edge, ', type:', edge.type);

            // Composition and Aggregation edges need to be ordered reversely
            if (edge.type === 'Composition' || edge.type === 'Aggregation') {
                createOperation = CreateEdgeOperation.create({
                    elementTypeId: `CLASS__${edge.type}`,
                    sourceElementId: `temp_${edge.toId}`,
                    targetElementId: `temp_${edge.fromId}`
                });
            } else {
                createOperation = CreateEdgeOperation.create({
                    elementTypeId: `CLASS__${edge.type}`,
                    sourceElementId: `temp_${edge.fromId}`,
                    targetElementId: `temp_${edge.toId}`
                });
            }

            const updateActions: UpdateElementPropertyAction[] = [];

            if (edge.label) {
                updateActions.push(
                    UpdateElementPropertyAction.create({
                        elementId: tempId,
                        propertyId: 'name',
                        value: edge.label
                    })
                );
            }

            return {
                tempCreationId: tempId,
                createOperation,
                updateActions
            };
        }

        for (const node of diagram.nodes) {
            operations.push(handleNode(node));
            for (const property of node.properties) {
                operations.push(handleProperty(node, property));
            }
            for (const operation of node.operations) {
                operations.push(handleOperation(node, operation));
            }
        }

        for (const edge of diagram.edges) {
            operations.push(handleEdge(edge));
        }

        this.actionDispatcher.dispatch(BatchCreateOperation.create(operations));
    }
}
