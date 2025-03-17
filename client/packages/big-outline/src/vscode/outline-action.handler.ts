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
import { getUMLObjectType, UMLEObjectReference, UMLSourceModel } from '@borkdominik-biguml/uml-protocol';
import { DisposableCollection } from '@eclipse-glsp/protocol';
import { inject, injectable, postConstruct } from 'inversify';
import { RequestOutlineAction, SetOutlineAction } from '../common/outline.action.js';
import type { OutlineTreeNode } from '../common/outline.model.js';

@injectable()
export class ExperimentalOutlineActionHandler implements Disposable {
    @inject(TYPES.ActionDispatcher)
    protected readonly actionDispatcher: ActionDispatcher;
    @inject(TYPES.ActionListener)
    protected readonly actionListener: ActionListener;
    @inject(EXPERIMENTAL_TYPES.GLSPServerModelState)
    protected readonly modelState: ExperimentalGLSPServerModelState;

    protected readonly toDispose = new DisposableCollection();

    @postConstruct()
    protected init(): void {
        this.toDispose.push(
            this.actionListener.handleGLSPRequest<RequestOutlineAction>(RequestOutlineAction.KIND, async () => {
                return this.createOutline();
            })
        );
    }

    dispose(): void {
        this.toDispose.dispose();
    }

    protected createOutline(): SetOutlineAction {
        const model = this.modelState.getModelState();
        if (!model) {
            return SetOutlineAction.create({
                outlineTreeNodes: []
            });
        }

        return SetOutlineAction.create({
            outlineTreeNodes: this.createOutlineTreeNode(model.getSourceModel())
        });
    }

    protected ignoreList = [UMLEObjectReference.is];
    protected createOutlineTreeNode(element: any): OutlineTreeNode[] {
        const nodes: OutlineTreeNode[] = [];

        if (this.ignoreList.some(check => check(element))) {
            return nodes;
        }

        if (UMLSourceModel.is(element)) {
            nodes.push({
                semanticUri: element.id,
                label: 'Model',
                iconClass: 'model',
                isRoot: true,
                children: element.packagedElement?.flatMap(element => this.createOutlineTreeNode(element)) ?? []
            });
        } else if (element && typeof element === 'object') {
            let id = '';
            let name = '';

            if ('id' in element) {
                id = element.id;
            }
            if ('name' in element) {
                name = element.name;
            }

            const children: OutlineTreeNode[] = [];
            for (const key in element) {
                if (Object.prototype.hasOwnProperty.call(element, key) && Array.isArray(element[key])) {
                    children.push(...element[key].flatMap((child: any) => this.createOutlineTreeNode(child)));
                }
            }

            const prefix = getUMLObjectType(element);
            nodes.push({
                semanticUri: id,
                label: `[${prefix ?? 'unknown'}] ${name}`,
                children,
                iconClass: 'element',
                isRoot: false
            });
        }

        return nodes;
    }
}
