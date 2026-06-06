/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 * Copyright (c) 2023 CrossBreeze.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { type AstNodeDescription, type GrammarAST, type MaybePromise, type ReferenceInfo, type Stream } from 'langium';
import { type CompletionAcceptor, type CompletionContext, DefaultCompletionProvider, type NextFeature } from 'langium/lsp';
import { type UmlDiagramServices } from './uml-diagram-module.js';
import { isExternalDescriptionForLocalPackage } from './uml-diagram-scope.js';

/**
 * Custom completion provider that only shows the short options to the user if a longer, fully-qualified version is also available.
 */
export class UmlDiagramCompletionProvider extends DefaultCompletionProvider {
    protected packageId?: string;

    constructor(
        services: UmlDiagramServices,
        protected packageManager = services.shared.workspace.PackageManager
    ) {
        super(services);
    }

    protected override completionForCrossReference(
        context: CompletionContext,
        crossRef: NextFeature<GrammarAST.CrossReference>,
        acceptor: CompletionAcceptor
    ): MaybePromise<void> {
        this.packageId = this.packageManager.getPackageIdByDocument(context.document);
        try {
            return super.completionForCrossReference(context, crossRef, acceptor);
        } finally {
            this.packageId = undefined;
        }
    }

    protected override getReferenceCandidates(refInfo: ReferenceInfo, context: CompletionContext): Stream<AstNodeDescription> {
        return super
            .getReferenceCandidates(refInfo, context)
            .filter(description => !isExternalDescriptionForLocalPackage(description, this.packageId));
    }
}
