/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/

import { AstNode, AstNodeDescription, DefaultScopeComputation, LangiumDocument, PrecomputedScopes, streamAllContents } from 'langium';
import { CancellationToken } from 'vscode-jsonrpc';
import { UmlServices } from './uml-module.js';
import { QualifiedNameProvider } from './uml-naming.js';
import { UmlPackageManager, UNKNOWN_PROJECT_ID, UNKNOWN_PROJECT_REFERENCE } from './uml-package-manager.js';

/**
 * Custom node description that wraps a given description under a potentially new name and also stores the package id for faster access.
 */
export class PackageAstNodeDescription implements AstNodeDescription {
   constructor(
      public packageId: string,
      public name: string,
      public delegate: AstNodeDescription,
      public node = delegate.node,
      public nameSegment = delegate.nameSegment,
      public selectionSegment = delegate.selectionSegment,
      public type = delegate.type,
      public documentUri = delegate.documentUri,
      public path = delegate.path
   ) {}
}

/**
 * Custom class to represent package-local descriptions without the package name so we can do easier instanceof checks.
 */
export class PackageLocalAstNodeDescription extends PackageAstNodeDescription {
   constructor(packageName: string, name: string, delegate: AstNodeDescription) {
      super(packageName, name, delegate);
   }
}

/**
 * Custom class to represent package-external descriptions with the package name so we can do easier instanceof checks.
 */
export class PackageExternalAstNodeDescription extends PackageAstNodeDescription {
   constructor(packageName: string, name: string, delegate: AstNodeDescription) {
      super(packageName, name, delegate);
   }
}

export function isExternalDescriptionForLocalPackage(description: AstNodeDescription, packageId?: string): boolean {
   return packageId !== undefined && description instanceof PackageExternalAstNodeDescription && description.packageId === packageId;
}

/**
 * A scope computer that performs the following customizations:
 * - Avoid exporting any nodes from diagrams, they are self-contained and do not need to be externally accessible.
 * - Store the package id for each node so we can do faster dependency calculation.
 * - Export nodes twice: Once for external usage with the fully-qualified name and once for package-local usage.
 */
export class UmlScopeComputation extends DefaultScopeComputation {
   declare nameProvider: QualifiedNameProvider;
   protected packageManager: UmlPackageManager;

   constructor(services: UmlServices) {
      super(services);
      this.nameProvider = services.references.QualifiedNameProvider;
      this.packageManager = services.shared.workspace.PackageManager;
   }

   // overridden because we use 'streamAllContents' as children retrieval instead of 'streamContents'
   override async computeExportsForNode(
      parentNode: AstNode,
      document: LangiumDocument<AstNode>,
      children: (root: AstNode) => Iterable<AstNode> = streamAllContents,
      cancelToken: CancellationToken = CancellationToken.None
   ): Promise<AstNodeDescription[]> {
      const docRoot = document.parseResult.value;
      return super.computeExportsForNode(parentNode, document, children, cancelToken);
   }

   protected override exportNode(node: AstNode, exports: AstNodeDescription[], document: LangiumDocument<AstNode>): void {
      const packageInfo = this.packageManager.getPackageInfoByDocument(document);
      const packageId = packageInfo?.id ?? UNKNOWN_PROJECT_ID;
      const packageName = packageInfo?.referenceName ?? UNKNOWN_PROJECT_REFERENCE;
      const packageQualifiedName = this.nameProvider.getFullyQualifiedName(node, packageName);

      // Export nodes twice: Once for external usage with the fully-qualified name and once for package-local usage.
      // To avoid duplicates in the UI but still allow access to the node through both names we filter the
      // external usage descriptions in the CrossModelCompletionProvider if package-local usage is also available

      let description: AstNodeDescription | undefined;
      if (packageQualifiedName) {
         description = this.descriptions.createDescription(node, packageQualifiedName, document);
         exports.push(new PackageExternalAstNodeDescription(packageId, packageQualifiedName, description));
      }
      const documentLocalName = this.nameProvider.getQualifiedName(node);
      if (documentLocalName && description) {
         exports.push(new PackageLocalAstNodeDescription(packageId, documentLocalName, description));
      }
   }

   protected override processNode(node: AstNode, document: LangiumDocument, scopes: PrecomputedScopes): void {
      const container = node.$container;
      if (container) {
         const name = this.nameProvider.getLocalName(node);
         if (name) {
            scopes.add(container, this.descriptions.createDescription(node, name, document));
         }
      }
   }
}