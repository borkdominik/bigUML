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
    DiagramServer,
    GLSPGraph,
    IActionDispatcher,
    SModelRoot,
    SModelRootListener
} from "@eclipse-glsp/client";
import { injectable } from "inversify";

import { RequestOutlineAction, SetOutlineAction } from "./actions";
import { OutlineTreeNode } from "./outline-tree-node";

@injectable()
export abstract class DiagramOutlineService implements SModelRootListener {
    protected actionDispatcher: IActionDispatcher;
    protected diagramServer: DiagramServer;
    protected outlineNodes: OutlineTreeNode[] = [];

    connect(diagramServer: DiagramServer, actionDispatcher: IActionDispatcher): void {
        this.diagramServer = diagramServer;
        this.actionDispatcher = actionDispatcher;
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
        await this.actionDispatcher.dispatch(new CenterAction([outlineNode.semanticUri]));
    }

    abstract updateOutline(outlineNodes: OutlineTreeNode[]): void;
}

