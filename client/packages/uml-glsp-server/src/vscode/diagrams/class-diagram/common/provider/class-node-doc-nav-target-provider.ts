/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { inject, injectable } from 'inversify';
import { AbstractNodeDocumentationNavigationTargetProvider } from '../../../../common/provider/abstract-node-doc-nav-target-provider.js';
import { ClassDiagramModelState } from '../../model/class-diagram-model-state.js';
import { GClassNode } from '../../model/elements/class.graph-extension.js';

@injectable()
export class ClassDiagramNodeDocumentationNavigationTargetProvider extends AbstractNodeDocumentationNavigationTargetProvider<
    GClassNode,
    ClassDiagramModelState
> {
    @inject(ClassDiagramModelState)
    readonly modelState!: ClassDiagramModelState;

    protected readonly nodeCtor = GClassNode;

    // Optional: override hooks if you ever change eligibility, doc path, or range.
    // protected override isEligible(node: GClassNode) { return node.name === '...'; }
    // protected override getDocUriFromSource(src: string, node: GClassNode) { ... }
    // protected override getOpenRange(node: GClassNode) { ... }
}
