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

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

import org.apache.log4j.Logger;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.util.EcoreUtil;
import org.eclipse.emfcloud.modelserver.client.Response;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCommandFactory;
import org.eclipse.emfcloud.modelserver.command.CCompoundCommand;
import org.eclipse.emfcloud.modelserver.glsp.EMSModelServerAccess;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.types.ElementAndBounds;
import org.eclipse.glsp.server.types.ElementAndRoutingPoints;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.uml2.uml.Activity;
import org.eclipse.uml2.uml.Actor;
import org.eclipse.uml2.uml.Association;
import org.eclipse.uml2.uml.Classifier;
import org.eclipse.uml2.uml.Comment;
import org.eclipse.uml2.uml.Component;
import org.eclipse.uml2.uml.Constraint;
import org.eclipse.uml2.uml.Element;
import org.eclipse.uml2.uml.Extend;
import org.eclipse.uml2.uml.ExtensionPoint;
import org.eclipse.uml2.uml.Generalization;
import org.eclipse.uml2.uml.Include;
import org.eclipse.uml2.uml.NamedElement;
import org.eclipse.uml2.uml.Package;
import org.eclipse.uml2.uml.UseCase;
import org.eclipse.uml2.uml.resource.UMLResource;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.modelserver.UmlModelServerClient;
import com.eclipsesource.uml.modelserver.UmlNotationUtil;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.comment.AddCommentCommandContribution;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.comment.LinkCommentCommandContribution;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.comment.RemoveCommentCommandContribution;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.comment.SetBodyCommandContribution;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.comment.UnlinkCommentCommandContribution;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.condition.AddConditionCommandContribution;
import com.eclipsesource.uml.modelserver.commands.commons.contributions.ChangeBoundsCommandContribution;
import com.eclipsesource.uml.modelserver.commands.commons.contributions.ChangeRoutingPointsCommandContribution;
import com.eclipsesource.uml.modelserver.commands.commons.contributions.RenameElementCommandContribution;
import com.eclipsesource.uml.modelserver.commands.usecasediagram.actor.AddActorCommandContribution;
import com.eclipsesource.uml.modelserver.commands.usecasediagram.actor.RemoveActorCommandContribution;
import com.eclipsesource.uml.modelserver.commands.usecasediagram.actor.SetActorNameCommandContribution;
import com.eclipsesource.uml.modelserver.commands.usecasediagram.association.AddUseCaseAssociationCommandContribution;
import com.eclipsesource.uml.modelserver.commands.usecasediagram.association.RemoveUseCaseAssociationCommandContribution;
import com.eclipsesource.uml.modelserver.commands.usecasediagram.component.AddComponentCommandContribution;
import com.eclipsesource.uml.modelserver.commands.usecasediagram.component.RemoveComponentCommandContribution;
import com.eclipsesource.uml.modelserver.commands.usecasediagram.extendedge.AddExtendCommandContribution;
import com.eclipsesource.uml.modelserver.commands.usecasediagram.extendedge.RemoveExtendCommandContribution;
import com.eclipsesource.uml.modelserver.commands.usecasediagram.extensionpoint.RemoveExtensionPointCommandContribution;
import com.eclipsesource.uml.modelserver.commands.usecasediagram.extensionpoint.SetExtensionPointNameCommandContribution;
import com.eclipsesource.uml.modelserver.commands.usecasediagram.generalization.AddGeneralizationCommandContribution;
import com.eclipsesource.uml.modelserver.commands.usecasediagram.generalization.RemoveGeneralizationCommandContribution;
import com.eclipsesource.uml.modelserver.commands.usecasediagram.includeedge.AddIncludeCommandContribution;
import com.eclipsesource.uml.modelserver.commands.usecasediagram.includeedge.RemoveIncludeCommandContribution;
import com.eclipsesource.uml.modelserver.commands.usecasediagram.usecase.AddUseCaseCommandContribution;
import com.eclipsesource.uml.modelserver.commands.usecasediagram.usecase.RemoveUseCaseCommandContribution;
import com.eclipsesource.uml.modelserver.commands.usecasediagram.usecase.SetUseCaseNameCommandContribution;
import com.eclipsesource.uml.modelserver.commands.usecasediagram.usecasepackage.AddPackageCommandContribution;
import com.eclipsesource.uml.modelserver.commands.usecasediagram.usecasepackage.RemovePackageCommandContribution;
import com.eclipsesource.uml.modelserver.commands.usecasediagram.usecasepackage.SetPackageNameCommandContribution;
import com.eclipsesource.uml.modelserver.unotation.Edge;
import com.eclipsesource.uml.modelserver.unotation.Shape;
import com.google.common.base.Preconditions;

public class UseCaseModelServerAccess extends EMSModelServerAccess {

   private static final Logger LOGGER = Logger.getLogger(UseCaseModelServerAccess.class);
   private final UmlModelServerClient modelServerClient;
   protected String notationFileExtension;

   public UseCaseModelServerAccess(final String sourceURI, final UmlModelServerClient modelServerClient) {
      super(sourceURI, modelServerClient, UMLResource.FILE_EXTENSION);
      Preconditions.checkNotNull(modelServerClient);
      this.notationFileExtension = UmlNotationUtil.NOTATION_EXTENSION;
      this.modelServerClient = modelServerClient;
   }

   @Override
   public EObject getSemanticModel() {
      try {
         return modelServerClient.get(getSemanticURI(), UMLResource.FILE_EXTENSION).thenApply(res -> res.body()).get();
      } catch (InterruptedException | ExecutionException e) {
         LOGGER.error(e);
         throw new GLSPServerException("Error during model loading", e);
      }
   }

   public String getNotationUri() { return baseSourceUri.appendFileExtension(this.notationFileExtension).toString(); }

   public EObject getNotationModel() {
      try {
         return modelServerClient.get(getNotationUri(), FORMAT_XMI).thenApply(res -> res.body()).get();
      } catch (InterruptedException | ExecutionException e) {
         LOGGER.error(e);
         throw new GLSPServerException("Error during model loading", e);
      }
   }

   protected String getSemanticUriFragment(final EObject element) {
      return EcoreUtil.getURI(element).fragment();
   }

   /*
    * Types
    */
   public CompletableFuture<Response<List<String>>> getUmlTypes() {
      return this.modelServerClient.getUmlTypes(getSemanticURI());
   }

   // FIXME
   public CompletableFuture<Response<List<String>>> getUmlBehaviors() {
      // return this.modelServerClient.getUmlBehaviors(getSemanticURI());
      return null;
   }
   // ======= COMMON ========

   /*
    * UML Constraint
    */
   public CompletableFuture<Response<Boolean>> addCondition(final UmlModelState modelState,
      final Optional<GPoint> newPosition,
      final Activity parent,
      final boolean isPrecondition) {
      CCompoundCommand addActivityCompoundCommand = AddConditionCommandContribution
         .create(getSemanticUriFragment(parent), isPrecondition);
      return this.edit(addActivityCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> setConditionBody(final UmlModelState modelState,
      final Constraint constraint, final String body) {

      CCommand renameameCommand = SetBodyCommandContribution.create(getSemanticUriFragment(constraint),
         body);
      return this.edit(renameameCommand);
   }

   /*
    * UML Comment
    */
   public CompletableFuture<Response<Boolean>> addComment(final UmlModelState modelState,
      final GPoint position, final EObject object) {

      CCompoundCommand addPartitionCompoundCommand = AddCommentCommandContribution
         .create(position, getSemanticUriFragment(object));
      return this.edit(addPartitionCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> setCommentBody(final UmlModelState modelState,
      final Comment comment, final String name) {

      CCommand renameameCommand = SetBodyCommandContribution.create(getSemanticUriFragment(comment),
         name);
      return this.edit(renameameCommand);
   }

   public CompletableFuture<Response<Boolean>> removeComment(final UmlModelState modelState,
      final Comment comment) {
      CCommand removePropertyCommand = RemoveCommentCommandContribution
         .create(getSemanticUriFragment(comment));
      return this.edit(removePropertyCommand);
   }

   public CompletableFuture<Response<Boolean>> linkComment(final UmlModelState modelState,
      final Comment comment, final Element element) {

      CCommand renameameCommand = LinkCommentCommandContribution.create(getSemanticUriFragment(comment),
         getSemanticUriFragment(element));
      return this.edit(renameameCommand);
   }

   public CompletableFuture<Response<Boolean>> unlinkComment(final UmlModelState modelState,
      final Comment comment, final Element element) {

      CCommand renameameCommand = UnlinkCommentCommandContribution.create(getSemanticUriFragment(comment),
         getSemanticUriFragment(element));
      return this.edit(renameameCommand);
   }

   // Change Bounds
   public CompletableFuture<Response<Boolean>> changeBounds(final Map<Shape, ElementAndBounds> changeBoundsMap) {
      CCompoundCommand compoundCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
      compoundCommand.setType(ChangeBoundsCommandContribution.TYPE);
      changeBoundsMap.forEach((shape, elementAndBounds) -> {
         CCommand changeBoundsCommand = ChangeBoundsCommandContribution.create(shape.getSemanticElement().getUri(),
            elementAndBounds.getNewPosition(), elementAndBounds.getNewSize());
         compoundCommand.getCommands().add(changeBoundsCommand);
      });
      return this.edit(compoundCommand);
   }

   // Change Routing Points
   public CompletableFuture<Response<Boolean>> changeRoutingPoints(
      final Map<Edge, ElementAndRoutingPoints> changeBendPointsMap) {
      CCompoundCommand compoundCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
      compoundCommand.setType(ChangeRoutingPointsCommandContribution.TYPE);

      changeBendPointsMap.forEach((edge, elementAndRoutingPoints) -> {
         CCommand changeRoutingPointsCommand = ChangeRoutingPointsCommandContribution.create(
            edge.getSemanticElement().getUri(), elementAndRoutingPoints.getNewRoutingPoints());
         compoundCommand.getCommands().add(changeRoutingPointsCommand);
      });
      return this.edit(compoundCommand);
   }

   /*
    * Renaming
    */
   public CompletableFuture<Response<Boolean>> renameElement(final UmlModelState modelState,
      final NamedElement element, final String name) {

      CCommand renameameCommand = RenameElementCommandContribution.create(getSemanticUriFragment(element),
         name);
      return this.edit(renameameCommand);
   }

   // ================== CONTENT =================

   /*
    * USECASE DIAGRAM
    */
   // USECASE
   public CompletableFuture<Response<Boolean>> addUseCase(final UmlModelState modelState,
      final Optional<GPoint> newPosition) {
      CCompoundCommand addUseCaseCompoundCommand = AddUseCaseCommandContribution
         .create(newPosition.orElse(GraphUtil.point(0, 0)));
      return this.edit(addUseCaseCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> addUseCase(final UmlModelState modelState, final EObject parent,
      final Optional<GPoint> newPosition) {
      /*
       * if (!(parent instanceof Package || parent instanceof Component)) {
       * throw new Exception("Element not valid as a parent for usecase");
       * }
       */
      CCommand addUseCaseCompoundCommand = AddUseCaseCommandContribution.create(
         newPosition.orElse(GraphUtil.point(0, 0)),
         getSemanticUriFragment(parent));
      return this.edit(addUseCaseCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removeUseCase(final UmlModelState modelState,
      final UseCase usecaseToRemove) {

      String semanticProxyUri = getSemanticUriFragment(usecaseToRemove);
      CCompoundCommand compoundCommand = RemoveUseCaseCommandContribution.create(semanticProxyUri);
      return this.edit(compoundCommand);
   }

   public CompletableFuture<Response<Boolean>> setUseCaseName(final UmlModelState modelState,
      final UseCase useCaseToRename, final String newName) {

      CCommand setUsecaseNameCommand = SetUseCaseNameCommandContribution.create(getSemanticUriFragment(useCaseToRename),
         newName);
      return this.edit(setUsecaseNameCommand);
   }

   public CompletableFuture<Response<Boolean>> removeExtensionPoint(final UmlModelState modelState,
      final ExtensionPoint epToRemove) {

      String semanticProxyUri = getSemanticUriFragment(epToRemove);
      CCompoundCommand compoundCommand = RemoveExtensionPointCommandContribution.create(semanticProxyUri);
      return this.edit(compoundCommand);
   }

   public CompletableFuture<Response<Boolean>> setExtensionPointName(final UmlModelState modelState,
      final ExtensionPoint epToRename, final String newName) {

      CCommand setExtensionPointNameCommand = SetExtensionPointNameCommandContribution.create(
         getSemanticUriFragment(epToRename),
         newName);
      return this.edit(setExtensionPointNameCommand);
   }

   // PACKAGE
   public CompletableFuture<Response<Boolean>> addPackage(final UmlModelState modelState,
      final Optional<GPoint> newPosition,
      final NamedElement parentContainer) {
      CCompoundCommand addPackageCompoundCommand = AddPackageCommandContribution
         .create(getSemanticUriFragment(parentContainer), newPosition.orElse(GraphUtil.point(0, 0)));
      return this.edit(addPackageCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removePackage(final UmlModelState modelState,
      final Package packageToRemove) {
      String semanticProxyUri = getSemanticUriFragment(packageToRemove);
      CCompoundCommand compoundCommand = RemovePackageCommandContribution.create(semanticProxyUri);
      return this.edit(compoundCommand);
   }

   public CompletableFuture<Response<Boolean>> setPackageName(final UmlModelState modelState,
      final Package packageToRename, final String newName) {
      CCommand setPackageNameCommand = SetPackageNameCommandContribution
         .create(getSemanticUriFragment(packageToRename), newName);
      return this.edit(setPackageNameCommand);
   }

   // CONTAINER
   /*
    * public CompletableFuture<Response<Boolean>> addComponent(final UmlModelState modelState,
    * final Optional<GPoint> newPosition) {
    * CCompoundCommand addComponentCompoundCommand = AddComponentCommandContribution
    * .create(newPosition.orElse(GraphUtil.point(0, 0)));
    * return this.edit(addComponentCompoundCommand);
    * }
    */

   public CompletableFuture<Response<Boolean>> addComponent(final UmlModelState modelState,
      final Package parent,
      final Optional<GPoint> newPosition) {

      CCompoundCommand addComponentCompoundCommand = AddComponentCommandContribution
         .create(getSemanticUriFragment(parent), newPosition.orElse(GraphUtil.point(0, 0)));
      return this.edit(addComponentCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removeComponent(final UmlModelState modelState,
      final Component componentToRemove) {
      String semanticProxyUri = getSemanticUriFragment(componentToRemove);
      CCompoundCommand compoundCommand = RemoveComponentCommandContribution.create(semanticProxyUri);
      return this.edit(compoundCommand);
   }

   // ACTOR
   public CompletableFuture<Response<Boolean>> addActor(final UmlModelState modelState,
      final Optional<GPoint> newPosition) {
      CCompoundCommand addActorCompoundCommand = AddActorCommandContribution
         .create(newPosition.orElse(GraphUtil.point(0, 0)));
      return this.edit(addActorCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> addActor(final UmlModelState modelState,
      final Package parent,
      final Optional<GPoint> newPosition) {
      CCommand addActorCompoundCommand = AddActorCommandContribution
         .create(newPosition.orElse(GraphUtil.point(0, 0)),
            getSemanticUriFragment(parent));
      return this.edit(addActorCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removeActor(final UmlModelState modelState,
      final Actor actorToRemove) {

      String semanticProxyUri = getSemanticUriFragment(actorToRemove);
      CCompoundCommand compoundCommand = RemoveActorCommandContribution.create(semanticProxyUri);
      return this.edit(compoundCommand);
   }

   public CompletableFuture<Response<Boolean>> setActorName(final UmlModelState modelState,
      final Actor actorToRename, final String newName) {

      CCommand setActorNameCommand = SetActorNameCommandContribution.create(getSemanticUriFragment(actorToRename),
         newName);
      return this.edit(setActorNameCommand);
   }

   // EXTEND
   public CompletableFuture<Response<Boolean>> addExtend(final UmlModelState modelState,
      final UseCase extendingUseCase, final UseCase extendedUseCase) {

      CCompoundCommand addExtensionCompoundCommand = AddExtendCommandContribution
         .create(getSemanticUriFragment(extendingUseCase), getSemanticUriFragment(extendedUseCase));
      return this.edit(addExtensionCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> addExtend(final UmlModelState modelState,
      final UseCase extendingUseCase, final ExtensionPoint extendedUseCase) {

      CCompoundCommand addExtensionCompoundCommand = AddExtendCommandContribution
         .create(getSemanticUriFragment(extendingUseCase), getSemanticUriFragment(extendedUseCase));
      return this.edit(addExtensionCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removeExtend(final UmlModelState modelState,
      final Extend extendToRemove) {

      String semanticProxyUri = getSemanticUriFragment(extendToRemove);
      CCompoundCommand compoundCommand = RemoveExtendCommandContribution.create(semanticProxyUri);
      return this.edit(compoundCommand);
   }

   // INCLUDE
   public CompletableFuture<Response<Boolean>> addInclude(final UmlModelState modelState,
      final UseCase includingUseCase, final UseCase includedUseCase) {
      CCompoundCommand addIncludeCompoundCommand = AddIncludeCommandContribution
         .create(getSemanticUriFragment(includingUseCase), getSemanticUriFragment(includedUseCase));
      return this.edit(addIncludeCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removeInclude(final UmlModelState modelState,
      final Include includeToRemove) {

      String semanticProxyUri = getSemanticUriFragment(includeToRemove);
      CCompoundCommand compoundCommand = RemoveIncludeCommandContribution.create(semanticProxyUri);
      return this.edit(compoundCommand);
   }

   // USECASE ASSOCIATION
   public CompletableFuture<Response<Boolean>> addUseCaseAssociation(final UmlModelState modelState,
      final Classifier generalClassifier, final Classifier specificClassifier) {

      CCompoundCommand addGeneralizationCompoundCommand = AddUseCaseAssociationCommandContribution
         .create(getSemanticUriFragment(generalClassifier), getSemanticUriFragment(specificClassifier));
      return this.edit(addGeneralizationCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removeUseCaseAssociation(final UmlModelState modelState,
      final Association associationToRemove) {

      String semanticProxyUri = getSemanticUriFragment(associationToRemove);
      CCompoundCommand compoundCommand = RemoveUseCaseAssociationCommandContribution.create(semanticProxyUri);
      return this.edit(compoundCommand);
   }

   // USECASE GENERALIZATION
   public CompletableFuture<Response<Boolean>> addGeneralization(final UmlModelState modelState,
      final Classifier generalClassifier, final Classifier specificClassifier) {
      CCompoundCommand addGeneralizationCompoundCommand = AddGeneralizationCommandContribution
         .create(getSemanticUriFragment(generalClassifier), getSemanticUriFragment(specificClassifier));
      return this.edit(addGeneralizationCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removeGeneralization(final UmlModelState modelState,
      final Generalization generalizationToRemove) {

      String semanticProxyUri = getSemanticUriFragment(generalizationToRemove);
      CCompoundCommand compoundCommand = RemoveGeneralizationCommandContribution.create(semanticProxyUri);
      return this.edit(compoundCommand);
   }

}
