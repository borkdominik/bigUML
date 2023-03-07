/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
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
    CenterAction,
    DiagramServerProxy,
    GLSPGraph,
    IActionDispatcher,
    ModelSource,
    SModelRoot,
    SModelRootListener
} from '@eclipse-glsp/client';
import { injectable } from 'inversify';

import { UmlOutlineTreeNode } from './outline-tree-node.model';
import { RequestOutlineAction, SetOutlineAction } from './outline.actions';

@injectable()
export abstract class UmlDiagramOutlineService implements SModelRootListener {
    protected actionDispatcher: IActionDispatcher;
    protected modelSource: ModelSource;
    protected diagramServerProxy?: DiagramServerProxy;
    protected outlineNodes: UmlOutlineTreeNode[] = [];

    connect(modelSource: ModelSource, actionDispatcher: IActionDispatcher): void {
        this.modelSource = modelSource;
        this.actionDispatcher = actionDispatcher;

        if (modelSource instanceof DiagramServerProxy) {
            this.diagramServerProxy = modelSource;
        }
    }

    get nodes(): UmlOutlineTreeNode[] {
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

    async center(outlineNode: UmlOutlineTreeNode): Promise<void> {
        await this.actionDispatcher.dispatch(CenterAction.create([outlineNode.semanticUri]));
    }

    abstract updateOutline(outlineNodes: UmlOutlineTreeNode[]): void;
}
