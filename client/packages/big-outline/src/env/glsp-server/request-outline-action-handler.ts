/*********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import type { OutlineTreeNode } from '@borkdominik-biguml/big-outline';
import { RequestOutlineAction, SetOutlineAction } from '@borkdominik-biguml/big-outline';
import { DiagramModelState } from '@borkdominik-biguml/uml-glsp-server/vscode';
import { type ActionHandler, type MaybePromise } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';

@injectable()
export class RequestOutlineActionHandler implements ActionHandler {
    actionKinds = [RequestOutlineAction.KIND];

    @inject(DiagramModelState)
    protected modelState!: DiagramModelState;

    execute(_action: RequestOutlineAction): MaybePromise<any[]> {
        if (this.modelState.semanticRoot.diagram.diagramType !== 'CLASS') {
            return [SetOutlineAction.create({ outlineTreeNodes: [] })];
        }
        const root = this.modelState.serializedSemanticRoot();
        const outlineTreeNodes = this.collectChildren(root);
        return [SetOutlineAction.create({ outlineTreeNodes })];
    }

    protected collectChildren(obj: Record<string, any>): OutlineTreeNode[] {
        const nodes: OutlineTreeNode[] = [];

        for (const value of Object.values(obj)) {
            if (Array.isArray(value)) {
                for (const item of value) {
                    if (this.isNamedObject(item)) {
                        nodes.push(this.toNode(item));
                    }
                }
            } else if (this.isNamedObject(value)) {
                nodes.push(this.toNode(value));
            }
        }

        return nodes;
    }

    protected toNode(obj: Record<string, any>): OutlineTreeNode {
        return {
            label: obj.name,
            semanticUri: obj.__id ?? '',
            children: this.collectChildren(obj),
            iconClass: 'element',
            isRoot: false
        };
    }

    protected isNamedObject(value: unknown): value is Record<string, any> {
        return typeof value === 'object' && value !== null && !Array.isArray(value) && typeof (value as any).name === 'string';
    }
}
