/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/
import { AstNodeDescription, DefaultScopeProvider, getDocument, ReferenceInfo, Scope, StreamScope } from 'langium';
import { UmlServices } from './uml-module.js';
import { PackageAstNodeDescription, PackageExternalAstNodeDescription } from './uml-scope.js';

/**
 * A custom scope provider that considers the dependencies between packages to indicate which elements form the global scope
 * are actually available from a certain document.
 */
export class PackageScopeProvider extends DefaultScopeProvider {
    constructor(
        protected services: UmlServices,
        protected packageManager = services.shared.workspace.PackageManager
    ) {
        super(services);
    }

    /**
     * Returns the package identifier for the given description.
     *
     * @param description node description
     * @returns package identifier
     */
    protected getPackageId(description: AstNodeDescription): string {
        return description instanceof PackageAstNodeDescription
            ? description.packageId
            : this.packageManager.getPackageIdByUri(description.documentUri);
    }

    protected override getGlobalScope(referenceType: string, context: ReferenceInfo): Scope {
        // the global scope contains all elements known to the language server
        const globalScope = super.getGlobalScope(referenceType, context);

        // see from which package this request is coming from based on the given context
        const source = getDocument(context.container);
        const sourcePackage = this.packageManager.getPackageIdByUri(source.uri);

        // dependencyScope: hide those elements from the global scope that are not visible from the requesting package
        const dependencyScope = new StreamScope(
            globalScope
                .getAllElements()
                .filter(
                    description =>
                        description instanceof PackageExternalAstNodeDescription &&
                        this.packageManager.isVisible(sourcePackage, this.getPackageId(description))
                )
        );

        // create a package-local scope that is considered first with the dependency scope being considered second
        // i.e., we build a hierarchy of scopes
        const packageScope = new StreamScope(
            globalScope.getAllElements().filter(description => sourcePackage === this.getPackageId(description)),
            dependencyScope
        );

        return packageScope;
    }
}

export class UmlScopeProvider extends PackageScopeProvider {}
