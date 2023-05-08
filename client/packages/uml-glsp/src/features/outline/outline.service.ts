/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import {
    CenterAction,
    DiagramServerProxy,
    GLSPGraph,
    IActionDispatcher,
    ModelSource,
    SModelRoot,
    SModelRootListener
} from '@eclipse-glsp/client';
import { injectable } from 'inversify';

import { OutlineTreeNode } from './outline-tree-node.model';
import { RequestOutlineAction, SetOutlineAction } from './outline.actions';

@injectable()
export abstract class OutlineService implements SModelRootListener {
    protected actionDispatcher: IActionDispatcher;
    protected modelSource: ModelSource;
    protected diagramServerProxy?: DiagramServerProxy;
    protected outlineNodes: OutlineTreeNode[] = [];

    connect(modelSource: ModelSource, actionDispatcher: IActionDispatcher): void {
        this.modelSource = modelSource;
        this.actionDispatcher = actionDispatcher;

        if (modelSource instanceof DiagramServerProxy) {
            this.diagramServerProxy = modelSource;
        }
    }

    get nodes(): OutlineTreeNode[] {
        return this.outlineNodes;
    }

    get isConnected(): boolean {
        return this.actionDispatcher !== undefined;
    }

    async modelRootChanged(root: Readonly<SModelRoot>): Promise<void> {
        if (root instanceof GLSPGraph) {
            await this.refresh();
        }
    }

    async refresh(): Promise<void> {
        const { outlineTreeNodes } = await this.actionDispatcher.request<SetOutlineAction>(new RequestOutlineAction());

        this.outlineNodes = outlineTreeNodes;
        this.updateOutline(outlineTreeNodes);
    }

    async center(outlineNode: OutlineTreeNode): Promise<void> {
        await this.actionDispatcher.dispatch(CenterAction.create([outlineNode.semanticUri]));
    }

    abstract updateOutline(outlineNodes: OutlineTreeNode[]): void;
}
