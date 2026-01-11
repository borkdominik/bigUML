/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { type Args, type EditorContext, type NavigationTarget } from '@eclipse-glsp/protocol';
import { type GModelElement, type GModelElementConstructor, JsonOpenerOptions, type NavigationTargetProvider } from '@eclipse-glsp/server';
import { injectable } from 'inversify';
import { type BaseDiagramModelState } from '../../features/model/base-diagram-model-state.js';

@injectable()
export abstract class AbstractNodeDocumentationNavigationTargetProvider<
    NodeT extends GModelElement,
    StateT extends BaseDiagramModelState
> implements NavigationTargetProvider {
    readonly targetTypeId = 'documentation';

    abstract readonly modelState: StateT;

    protected abstract readonly nodeCtor: GModelElementConstructor<NodeT>;

    protected isEligible(node: NodeT): boolean {
        return node.id === 'task0';
    }

    protected getDocUriFromSource(sourceUri: string, _node: NodeT): string | undefined {
        return sourceUri ? sourceUri.replace('.uml', '.md') : undefined;
    }

    protected getOpenRange(_node: NodeT) {
        return {
            start: { line: 2, character: 3 },
            end: { line: 2, character: 7 }
        };
    }

    // hooks can be overriden, if eligibility, doc path, or range are changed.

    getTargets(editorContext: EditorContext): NavigationTarget[] {
        if (!editorContext.selectedElementIds || editorContext.selectedElementIds.length !== 1) {
            return [];
        }

        const id = editorContext.selectedElementIds[0];
        const node = this.modelState.index.findByClass(id, this.nodeCtor);
        if (!node || !this.isEligible(node)) {
            return [];
        }

        const sourceUri = this.modelState.sourceUri;
        const docUri = sourceUri ? this.getDocUriFromSource(sourceUri, node) : undefined;
        if (!docUri) {
            return [];
        }

        const args: Args = {
            jsonOpenerOptions: new JsonOpenerOptions(this.getOpenRange(node)).toJson()
        };

        return [{ uri: docUri, args }];
    }
}
