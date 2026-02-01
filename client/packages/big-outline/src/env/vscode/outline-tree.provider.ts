/********************************************************************************
 * Copyright (c) 2020-2021 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
import {
    EXPERIMENTAL_TYPES,
    TYPES,
    type ActionDispatcher,
    type ActionListener,
    type ConnectionManager,
    type ExperimentalGLSPServerModelState,
    type SelectionService
} from '@borkdominik-biguml/big-vscode-integration/vscode';
import { SelectAllAction } from '@eclipse-glsp/protocol';
import { SelectAction } from '@eclipse-glsp/vscode-integration';
import { inject, injectable, postConstruct } from 'inversify';
import * as vscode from 'vscode';
import { RequestOutlineAction, SetOutlineAction, type OutlineTreeNode } from '../common/index.js';

export const OutlineViewId = Symbol('OutlineViewId');

@injectable()
export class OutlineTreeProvider implements vscode.TreeDataProvider<OutlineTreeNode>, vscode.Disposable {
    @inject(OutlineViewId)
    protected readonly viewId: string;

    @inject(TYPES.ActionDispatcher)
    protected readonly actionDispatcher: ActionDispatcher;
    @inject(TYPES.ActionListener)
    protected readonly actionListener: ActionListener;
    @inject(TYPES.ConnectionManager)
    protected readonly connectionManager: ConnectionManager;
    @inject(TYPES.SelectionService)
    protected readonly selectionService: SelectionService;
    @inject(EXPERIMENTAL_TYPES.GLSPServerModelState)
    protected readonly modelState: ExperimentalGLSPServerModelState;

    protected readonly iconMap = new Map<string, vscode.ThemeIcon>([
        ['model', vscode.ThemeIcon.Folder],
        ['edge', new vscode.ThemeIcon('arrow-both')],
        ['element', new vscode.ThemeIcon('symbol-class')]
    ]);

    protected onDidChangeTreeDataEmitter = new vscode.EventEmitter<OutlineTreeNode | undefined | null | void>();
    readonly onDidChangeTreeData = this.onDidChangeTreeDataEmitter.event;

    protected readonly disposables: vscode.Disposable[] = [];
    protected storage: OutlineTreeProvider.Storage = {
        data: [],
        flattened: []
    };

    protected selectionToUpdateContext: OutlineTreeProvider.SelectionUpdateContext = {};

    @postConstruct()
    initialize(): void {
        const treeView = vscode.window.createTreeView(this.viewId, {
            treeDataProvider: this,
            canSelectMany: false,
            showCollapseAll: true
        });
        this.disposables.push(
            treeView,
            treeView.onDidChangeSelection(e => this.requestSelection(e.selection[0])),
            treeView.onDidChangeVisibility(e => {
                if (e.visible && this.selectionToUpdateContext.selectedId) {
                    this.select([this.selectionToUpdateContext.selectedId], treeView);
                }
            }),
            this.selectionService.onDidSelectionChange(event => this.select(event.state.selectedElementsIDs, treeView)),
            this.connectionManager.onDidActiveClientChange(() => {
                this.actionDispatcher.dispatch(RequestOutlineAction.create());
            }),
            this.connectionManager.onNoActiveClient(() => {
                this.onNodesChanged([]);
            }),
            this.connectionManager.onNoConnection(() => {
                this.onNodesChanged([]);
            }),
            this.modelState.onDidChangeModelState(() => {
                this.actionDispatcher.dispatch(RequestOutlineAction.create());
            }),
            this.actionListener.registerListener(message => {
                const { action } = message;
                if (SetOutlineAction.is(action)) {
                    this.onNodesChanged(action.outlineTreeNodes);
                }
            })
        );
    }

    dispose(): void {
        this.disposables.forEach(d => d.dispose());
    }

    getTreeItem(element: OutlineTreeNode): vscode.TreeItem | Thenable<vscode.TreeItem> {
        const item = new vscode.TreeItem(element.label, this.getCollapsibleState(element));
        const iconType = element.iconClass;
        item.iconPath = this.iconMap.get(iconType);
        return item;
    }

    getChildren(element?: OutlineTreeNode | undefined): vscode.ProviderResult<OutlineTreeNode[]> {
        if (!element) {
            // root elements are requested
            return this.storage.data;
        }
        return element.children;
    }

    getParent(element: OutlineTreeNode): vscode.ProviderResult<OutlineTreeNode> {
        return this.storage.flattened.find(node => node.children.includes(element));
    }

    protected onNodesChanged(nodes: OutlineTreeNode[]): void {
        function recFlatMap(node: OutlineTreeNode): OutlineTreeNode[] {
            return [node, ...node.children.flatMap(c => recFlatMap(c))];
        }

        // The outline has changed. Update the tree view.
        this.storage = {
            data: nodes,
            flattened: nodes.flatMap(node => recFlatMap(node))
        };
        this.selectionToUpdateContext = {};
        // Update root
        this.onDidChangeTreeDataEmitter.fire(undefined);
    }

    protected getCollapsibleState(element: OutlineTreeNode): vscode.TreeItemCollapsibleState {
        if (element.children && element.children.length > 0) {
            return vscode.TreeItemCollapsibleState.Expanded;
        }
        return vscode.TreeItemCollapsibleState.None;
    }

    protected requestSelection(selection?: OutlineTreeNode): void {
        if (selection === undefined) {
            return;
        }

        const selectedId = selection.semanticUri;

        if (selection.isRoot || this.selectionToUpdateContext.selectedId === selectedId) {
            return;
        }
        this.selectionToUpdateContext = {
            selectedId
        };

        this.actionDispatcher.dispatch([
            SelectAllAction.create(false),
            SelectAction.create({
                selectedElementsIDs: [selectedId]
            })
        ]);
    }

    protected select(selection: string[], treeView: vscode.TreeView<OutlineTreeNode>): void {
        if (this.storage.data.length === 0) {
            return;
        }

        if (selection.length === 1 && selection[0] === null) {
            const node = this.storage.data[0];
            this.selectionToUpdateContext = {
                selectedId: node.semanticUri
            };
            this.reveal(treeView, node);
            return;
        }

        selection = selection.filter(s => s !== null && s !== undefined);
        const selectedId = selection.at(-1);

        if (selection.length === 0 || treeView.selection.some(s => s.semanticUri === selectedId)) {
            return;
        }

        let selectedNode = this.storage.flattened.find(node => node.semanticUri === selectedId && !node.isRoot);
        selectedNode = selectedNode ?? this.storage.data[0];

        this.selectionToUpdateContext = {
            selectedId: selectedNode.semanticUri
        };

        this.reveal(treeView, selectedNode);
    }

    protected reveal(treeView: vscode.TreeView<OutlineTreeNode>, selectedNode: OutlineTreeNode): void {
        if (treeView.visible) {
            treeView.reveal(selectedNode, { select: true, focus: false, expand: false });
        }
    }
}

export namespace OutlineTreeProvider {
    export interface Storage {
        data: OutlineTreeNode[];
        flattened: OutlineTreeNode[];
    }

    export interface SelectionUpdateContext {
        selectedId?: string;
    }
}
