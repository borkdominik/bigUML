/********************************************************************************
 * Copyright (c) 2020-2021 EclipseSource and others.
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
import { OutlineTreeNode } from '@borkdominik-biguml/uml-glsp/lib/features/outline';
import { SelectAction } from '@eclipse-glsp/vscode-integration';
import { inject, injectable, postConstruct } from 'inversify';
import * as vscode from 'vscode';
import { TYPES } from '../../di.types';
import { UVGlspConnector } from '../../glsp/connection/uv-glsp-connector';
import { VSCodeSettings } from '../../language';

@injectable()
export class OutlineIntegration implements vscode.TreeDataProvider<OutlineTreeNode>, vscode.Disposable {
    @inject(TYPES.Connector)
    protected readonly connector: UVGlspConnector;

    private readonly iconMap = new Map<string, vscode.ThemeIcon>([
        ['Package', vscode.ThemeIcon.Folder],
        ['Dependency', new vscode.ThemeIcon('arrow-up')],
        ['ElementImport', new vscode.ThemeIcon('arrow-left')],
        ['PackageImport', new vscode.ThemeIcon('arrow-left')],
        ['PackageMerge', new vscode.ThemeIcon('merge')],
        ['Class', new vscode.ThemeIcon('symbol-class')],
        ['Interface', new vscode.ThemeIcon('symbol-interface')],
        ['Enumeration', new vscode.ThemeIcon('symbol-enum')],
        ['EnumerationLiteral', new vscode.ThemeIcon('symbol-enum-member')],
        ['Property', new vscode.ThemeIcon('symbol-property')],
        ['Operation', new vscode.ThemeIcon('symbol-method')],
        ['Parameter', new vscode.ThemeIcon('symbol-parameter')],
        ['Generalization', new vscode.ThemeIcon('arrow-up')],
        ['Realization', new vscode.ThemeIcon('arrow-up')],
        ['Association', new vscode.ThemeIcon('arrow-up')],
        ['Aggregation', new vscode.ThemeIcon('arrow-up')],
        ['Composition', new vscode.ThemeIcon('arrow-up')],
        ['InterfaceRealization', new vscode.ThemeIcon('arrow-up')],
        ['Usage', new vscode.ThemeIcon('arrow-up')],
        ['Abstraction', new vscode.ThemeIcon('arrow-up')],
        ['DataType', new vscode.ThemeIcon('symbol-type-parameter')],
        ['PrimitiveType', new vscode.ThemeIcon('symbol-type-parameter')],
        ['Substitution', new vscode.ThemeIcon('arrow-up')]
    ]);

    private _onDidChangeTreeData = new vscode.EventEmitter<OutlineTreeNode | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<OutlineTreeNode | undefined | null | void> = this._onDidChangeTreeData.event;

    private readonly disposables: vscode.Disposable[] = [];

    private nodes: OutlineTreeNode[] = [];
    private flattenedNodes: OutlineTreeNode[] = [];

    /**
     * The origin of the selection update. This is used to prevent duplicate requests.
     * Changing the selection in the outline should only trigger a request, but not react to the SelectAction that is received as a result.
     * Similarly, reacting to a SelectAction should only trigger a selection update in the outline, but not trigger a request.
     */
    private selectionUpdateOrigin: 'outline' | 'editor' | undefined = undefined;

    @postConstruct()
    public initialize(): void {
        const treeView = vscode.window.createTreeView(VSCodeSettings.outline.viewType, {
            treeDataProvider: this,
            canSelectMany: true,
            showCollapseAll: true
        });
        this.disposables.push(
            treeView,
            treeView.onDidChangeSelection(e => this.requestSelection(e.selection)),
            this.connector.onSelectionUpdate(selection => this.showSelection(selection, treeView)),
            this.connector.onOutlineChanged(nodes => {
                // The outline has changed. Update the tree view.
                this.nodes = nodes;
                this.flattenedNodes = nodes.flatMap(node => [node, ...node.children]);
                this.selectionUpdateOrigin = undefined;
                this._onDidChangeTreeData.fire();
            })
        );
    }

    public dispose(): void {
        this.disposables.forEach(d => d.dispose());
    }

    public getTreeItem(element: OutlineTreeNode): vscode.TreeItem | Thenable<vscode.TreeItem> {
        const item = new vscode.TreeItem(element.label, this.getCollapsibleState(element));
        const iconType = element.label.substring(1, element.label.indexOf(']'));
        item.iconPath = this.iconMap.get(iconType);
        return item;
    }

    public getChildren(element?: OutlineTreeNode | undefined): vscode.ProviderResult<OutlineTreeNode[]> {
        if (!element) {
            // root elements are requested
            return this.nodes;
        }
        return element.children;
    }

    public getParent(element: OutlineTreeNode): vscode.ProviderResult<OutlineTreeNode> {
        return this.flattenedNodes.find(node => node.children.includes(element));
    }

    private getCollapsibleState(element: OutlineTreeNode): vscode.TreeItemCollapsibleState {
        if (element.children && element.children.length > 0) {
            return vscode.TreeItemCollapsibleState.Expanded;
        }
        return vscode.TreeItemCollapsibleState.None;
    }

    private requestSelection(selection: readonly OutlineTreeNode[]): void {
        if (this.selectionUpdateOrigin === 'editor') {
            this.selectionUpdateOrigin = undefined;
            return;
        }
        this.selectionUpdateOrigin = 'outline';
        // Keeping state of the selection and only unselecting actually selected elements does not work,
        // because edges in editing mode are apparently not part of the selection.
        const selectedElements = selection.map(node => node.semanticUri);
        const remainingNodes = this.flattenedNodes
            .filter(node => !selectedElements.includes(node.semanticUri))
            .map(({ semanticUri }) => semanticUri);
        const action = SelectAction.create({
            selectedElementsIDs: selectedElements,
            deselectedElementsIDs: remainingNodes
        });
        this.connector.requestSelection(action);
    }

    private showSelection(selection: string[], treeView: vscode.TreeView<OutlineTreeNode>): void {
        if (this.selectionUpdateOrigin === 'outline') {
            this.selectionUpdateOrigin = undefined;
            return;
        }
        this.selectionUpdateOrigin = 'editor';
        const nodesToSelect = this.flattenedNodes.filter(node => selection.includes(node.semanticUri));
        nodesToSelect.forEach(node => {
            if (treeView.selection.includes(node)) {
                return;
            }
            treeView.reveal(node, { select: true, focus: false, expand: true });
        });
    }
}
