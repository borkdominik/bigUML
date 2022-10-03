/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.usecase_diagram;

public class UseCaseModelServerAccess {
   /*-
   // ================== CONTENT =================
   
   /*
    * USECASE DIAGRAM
    *
   // USECASE
   public CompletableFuture<Response<String>> addUseCase(final UmlModelState modelState,
      final Optional<GPoint> newPosition) {
      CCompoundCommand addUseCaseCompoundCommand = AddUseCaseCommandContribution
         .create(newPosition.orElse(GraphUtil.point(0, 0)));
      return this.edit(addUseCaseCompoundCommand);
   }
   
   public CompletableFuture<Response<String>> addUseCase(final UmlModelState modelState, final EObject parent,
      final Optional<GPoint> newPosition) {
      /*
       * if (!(parent instanceof Package || parent instanceof Component)) {
       * throw new Exception("Element not valid as a parent for usecase");
       * }
       *
      CCommand addUseCaseCompoundCommand = AddUseCaseCommandContribution.create(
         newPosition.orElse(GraphUtil.point(0, 0)),
         getSemanticUriFragment(parent));
      return this.edit(addUseCaseCompoundCommand);
   }
   
   public CompletableFuture<Response<String>> removeUseCase(final UmlModelState modelState,
      final UseCase usecaseToRemove) {
   
      String semanticProxyUri = getSemanticUriFragment(usecaseToRemove);
      CCompoundCommand compoundCommand = RemoveUseCaseCommandContribution.create(semanticProxyUri);
      return this.edit(compoundCommand);
   }
   
   public CompletableFuture<Response<String>> setUseCaseName(final UmlModelState modelState,
      final UseCase useCaseToRename, final String newName) {
   
      CCommand setUsecaseNameCommand = SetUseCaseNameCommandContribution.create(getSemanticUriFragment(useCaseToRename),
         newName);
      return this.edit(setUsecaseNameCommand);
   }
   
   public CompletableFuture<Response<String>> removeExtensionPoint(final UmlModelState modelState,
      final ExtensionPoint epToRemove) {
   
      String semanticProxyUri = getSemanticUriFragment(epToRemove);
      CCompoundCommand compoundCommand = RemoveExtensionPointCommandContribution.create(semanticProxyUri);
      return this.edit(compoundCommand);
   }
   
   public CompletableFuture<Response<String>> setExtensionPointName(final UmlModelState modelState,
      final ExtensionPoint epToRename, final String newName) {
   
      CCommand setExtensionPointNameCommand = SetExtensionPointNameCommandContribution.create(
         getSemanticUriFragment(epToRename),
         newName);
      return this.edit(setExtensionPointNameCommand);
   }
   
   // PACKAGE
   public CompletableFuture<Response<String>> addPackage(final UmlModelState modelState,
      final Optional<GPoint> newPosition,
      final NamedElement parentContainer) {
      CCompoundCommand addPackageCompoundCommand = AddPackageCommandContribution
         .create(getSemanticUriFragment(parentContainer), newPosition.orElse(GraphUtil.point(0, 0)));
      return this.edit(addPackageCompoundCommand);
   }
   
   public CompletableFuture<Response<String>> removePackage(final UmlModelState modelState,
      final Package packageToRemove) {
      String semanticProxyUri = getSemanticUriFragment(packageToRemove);
      CCompoundCommand compoundCommand = RemovePackageCommandContribution.create(semanticProxyUri);
      return this.edit(compoundCommand);
   }
   
   public CompletableFuture<Response<String>> setPackageName(final UmlModelState modelState,
      final Package packageToRename, final String newName) {
      CCommand setPackageNameCommand = SetPackageNameCommandContribution
         .create(getSemanticUriFragment(packageToRename), newName);
      return this.edit(setPackageNameCommand);
   }
   
   // CONTAINER
   /*
    * public CompletableFuture<Response<String>> addComponent(final UmlModelState modelState,
    * final Optional<GPoint> newPosition) {
    * CCompoundCommand addComponentCompoundCommand = AddComponentCommandContribution
    * .create(newPosition.orElse(GraphUtil.point(0, 0)));
    * return this.edit(addComponentCompoundCommand);
    * }
    *
   
   public CompletableFuture<Response<String>> addComponent(final UmlModelState modelState,
      final Package parent,
      final Optional<GPoint> newPosition) {
   
      CCompoundCommand addComponentCompoundCommand = AddComponentCommandContribution
         .create(getSemanticUriFragment(parent), newPosition.orElse(GraphUtil.point(0, 0)));
      return this.edit(addComponentCompoundCommand);
   }
   
   public CompletableFuture<Response<String>> removeComponent(final UmlModelState modelState,
      final Component componentToRemove) {
      String semanticProxyUri = getSemanticUriFragment(componentToRemove);
      CCompoundCommand compoundCommand = RemoveComponentCommandContribution.create(semanticProxyUri);
      return this.edit(compoundCommand);
   }
   
   // ACTOR
   public CompletableFuture<Response<String>> addActor(final UmlModelState modelState,
      final Optional<GPoint> newPosition) {
      CCompoundCommand addActorCompoundCommand = AddActorCommandContribution
         .create(newPosition.orElse(GraphUtil.point(0, 0)));
      return this.edit(addActorCompoundCommand);
   }
   
   public CompletableFuture<Response<String>> addActor(final UmlModelState modelState,
      final Package parent,
      final Optional<GPoint> newPosition) {
      CCommand addActorCompoundCommand = AddActorCommandContribution
         .create(newPosition.orElse(GraphUtil.point(0, 0)),
            getSemanticUriFragment(parent));
      return this.edit(addActorCompoundCommand);
   }
   
   public CompletableFuture<Response<String>> removeActor(final UmlModelState modelState,
      final Actor actorToRemove) {
   
      String semanticProxyUri = getSemanticUriFragment(actorToRemove);
      CCompoundCommand compoundCommand = RemoveActorCommandContribution.create(semanticProxyUri);
      return this.edit(compoundCommand);
   }
   
   public CompletableFuture<Response<String>> setActorName(final UmlModelState modelState,
      final Actor actorToRename, final String newName) {
   
      CCommand setActorNameCommand = SetActorNameCommandContribution.create(getSemanticUriFragment(actorToRename),
         newName);
      return this.edit(setActorNameCommand);
   }
   
   // EXTEND
   public CompletableFuture<Response<String>> addExtend(final UmlModelState modelState,
      final UseCase extendingUseCase, final UseCase extendedUseCase) {
   
      CCompoundCommand addExtensionCompoundCommand = AddExtendCommandContribution
         .create(getSemanticUriFragment(extendingUseCase), getSemanticUriFragment(extendedUseCase));
      return this.edit(addExtensionCompoundCommand);
   }
   
   public CompletableFuture<Response<String>> addExtend(final UmlModelState modelState,
      final UseCase extendingUseCase, final ExtensionPoint extendedUseCase) {
   
      CCompoundCommand addExtensionCompoundCommand = AddExtendCommandContribution
         .create(getSemanticUriFragment(extendingUseCase), getSemanticUriFragment(extendedUseCase));
      return this.edit(addExtensionCompoundCommand);
   }
   
   public CompletableFuture<Response<String>> removeExtend(final UmlModelState modelState,
      final Extend extendToRemove) {
   
      String semanticProxyUri = getSemanticUriFragment(extendToRemove);
      CCompoundCommand compoundCommand = RemoveExtendCommandContribution.create(semanticProxyUri);
      return this.edit(compoundCommand);
   }
   
   // INCLUDE
   public CompletableFuture<Response<String>> addInclude(final UmlModelState modelState,
      final UseCase includingUseCase, final UseCase includedUseCase) {
      CCompoundCommand addIncludeCompoundCommand = AddIncludeCommandContribution
         .create(getSemanticUriFragment(includingUseCase), getSemanticUriFragment(includedUseCase));
      return this.edit(addIncludeCompoundCommand);
   }
   
   public CompletableFuture<Response<String>> removeInclude(final UmlModelState modelState,
      final Include includeToRemove) {
   
      String semanticProxyUri = getSemanticUriFragment(includeToRemove);
      CCompoundCommand compoundCommand = RemoveIncludeCommandContribution.create(semanticProxyUri);
      return this.edit(compoundCommand);
   }
   
   // USECASE ASSOCIATION
   public CompletableFuture<Response<String>> addUseCaseAssociation(final UmlModelState modelState,
      final Classifier generalClassifier, final Classifier specificClassifier) {
   
      CCompoundCommand addGeneralizationCompoundCommand = AddUseCaseAssociationCommandContribution
         .create(getSemanticUriFragment(generalClassifier), getSemanticUriFragment(specificClassifier));
      return this.edit(addGeneralizationCompoundCommand);
   }
   
   public CompletableFuture<Response<String>> removeUseCaseAssociation(final UmlModelState modelState,
      final Association associationToRemove) {
   
      String semanticProxyUri = getSemanticUriFragment(associationToRemove);
      CCompoundCommand compoundCommand = RemoveUseCaseAssociationCommandContribution.create(semanticProxyUri);
      return this.edit(compoundCommand);
   }
   
   // USECASE GENERALIZATION
   public CompletableFuture<Response<String>> addGeneralization(final UmlModelState modelState,
      final Classifier generalClassifier, final Classifier specificClassifier) {
      CCompoundCommand addGeneralizationCompoundCommand = AddGeneralizationCommandContribution
         .create(getSemanticUriFragment(generalClassifier), getSemanticUriFragment(specificClassifier));
      return this.edit(addGeneralizationCompoundCommand);
   }
   
   public CompletableFuture<Response<String>> removeGeneralization(final UmlModelState modelState,
      final Generalization generalizationToRemove) {
   
      String semanticProxyUri = getSemanticUriFragment(generalizationToRemove);
      CCompoundCommand compoundCommand = RemoveGeneralizationCommandContribution.create(semanticProxyUri);
      return this.edit(compoundCommand);
   }
   */
}
