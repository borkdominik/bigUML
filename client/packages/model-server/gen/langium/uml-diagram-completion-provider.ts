/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/
import {
    type AstNodeDescription,
    type CompletionAcceptor,
    type CompletionContext,
    DefaultCompletionProvider,
    type GrammarAST,
    type MaybePromise,
    type NextFeature
} from 'langium';
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
            super.completionForCrossReference(context, crossRef, acceptor);
        } finally {
            this.packageId = undefined;
        }
    }

    protected override filterCrossReference(context: CompletionContext, description: AstNodeDescription): boolean {
        // we want to keep fully qualified names in the scope so we can do proper linking
        // but want to hide it from the user for local options, i.e., if we are in the same project we can skip the project name
        return !isExternalDescriptionForLocalPackage(description, this.packageId) && super.filterCrossReference(context, description);
    }
}
