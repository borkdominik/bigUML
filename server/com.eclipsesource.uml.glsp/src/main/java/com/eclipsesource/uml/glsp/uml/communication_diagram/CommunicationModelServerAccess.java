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
package com.eclipsesource.uml.glsp.uml.communication_diagram;

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
import org.eclipse.uml2.uml.Comment;
import org.eclipse.uml2.uml.Constraint;
import org.eclipse.uml2.uml.Element;
import org.eclipse.uml2.uml.Interaction;
import org.eclipse.uml2.uml.Lifeline;
import org.eclipse.uml2.uml.Message;
import org.eclipse.uml2.uml.NamedElement;
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
import com.eclipsesource.uml.modelserver.commands.communication.interaction.AddInteractionCommandContribution;
import com.eclipsesource.uml.modelserver.commands.communication.interaction.CopyInteractionCommandContribution;
import com.eclipsesource.uml.modelserver.commands.communication.interaction.InteractionCopyableProperties;
import com.eclipsesource.uml.modelserver.commands.communication.interaction.RemoveInteractionCommandContribution;
import com.eclipsesource.uml.modelserver.commands.communication.interaction.SetInteractionNameCommandContribution;
import com.eclipsesource.uml.modelserver.commands.communication.lifeline.AddLifelineCommandContribution;
import com.eclipsesource.uml.modelserver.commands.communication.lifeline.CopyLifelineWithMessagesCommandContribution;
import com.eclipsesource.uml.modelserver.commands.communication.lifeline.LifelineCopyableProperties;
import com.eclipsesource.uml.modelserver.commands.communication.lifeline.RemoveLifelineCommandContribution;
import com.eclipsesource.uml.modelserver.commands.communication.lifeline.SetLifelineNameCommandContribution;
import com.eclipsesource.uml.modelserver.commands.communication.message.AddMessageCommandContribution;
import com.eclipsesource.uml.modelserver.commands.communication.message.MessageCopyableProperties;
import com.eclipsesource.uml.modelserver.commands.communication.message.RemoveMessageCommandContribution;
import com.eclipsesource.uml.modelserver.commands.communication.message.SetMessageNameCommandContribution;
import com.eclipsesource.uml.modelserver.unotation.Edge;
import com.eclipsesource.uml.modelserver.unotation.Shape;
import com.google.common.base.Preconditions;

public class CommunicationModelServerAccess extends EMSModelServerAccess {

   private static final Logger LOGGER = Logger.getLogger(CommunicationModelServerAccess.class);
   private final UmlModelServerClient modelServerClient;
   protected String notationFileExtension;

   public CommunicationModelServerAccess(final String sourceURI, final UmlModelServerClient modelServerClient) {
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
    * UML Communication
    */
   public CompletableFuture<Response<Boolean>> addInteraction(final UmlModelState modelState,
      final Optional<GPoint> newPosition) {

      CCompoundCommand addInteractionCompoundCommand = AddInteractionCommandContribution
         .create(newPosition.orElse(GraphUtil.point(0, 0)));
      return this.edit(addInteractionCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> setInteractionName(final UmlModelState modelState,
      final Interaction interactionToRename, final String newName) {

      CCommand setInteractionNameCommand = SetInteractionNameCommandContribution.create(
         getSemanticUriFragment(interactionToRename),
         newName);
      return this.edit(setInteractionNameCommand);
   }

   public CompletableFuture<Response<Boolean>> removeInteraction(final UmlModelState modelState,
      final Interaction interactionToRemove) {
      String semanticProxyUri = getSemanticUriFragment(interactionToRemove);
      CCompoundCommand compoundCommand = RemoveInteractionCommandContribution.create(semanticProxyUri);
      return this.edit(compoundCommand);

   }

   public CompletableFuture<Response<Boolean>> addLifeline(final UmlModelState modelState,
      final Interaction parentInteraction, final Optional<GPoint> newPosition) {

      CCompoundCommand addLifelineCompoundCommand = AddLifelineCommandContribution
         .create(getSemanticUriFragment(parentInteraction), newPosition.orElse(GraphUtil.point(0, 0)));
      return this.edit(addLifelineCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removeLifeline(final UmlModelState modelState,
      final Lifeline lifelineToRemove) {
      String semanticProxyUri = getSemanticUriFragment(lifelineToRemove);

      CCompoundCommand compoundCommand = RemoveLifelineCommandContribution.create(semanticProxyUri);
      return this.edit(compoundCommand);
   }

   public CompletableFuture<Response<Boolean>> setLifelineName(final UmlModelState modelState,
      final Lifeline lifelineToRename, final String newName) {

      CCommand setLifelineNameCommand = SetLifelineNameCommandContribution.create(
         getSemanticUriFragment(lifelineToRename),
         newName);
      return this.edit(setLifelineNameCommand);
   }

   public CompletableFuture<Response<Boolean>> addMessage(final UmlModelState modelState,
      final Lifeline sourceLifeline, final Lifeline targetLifeline) {

      CCompoundCommand addMessageCompoundCommand = AddMessageCommandContribution
         .create(getSemanticUriFragment(sourceLifeline), getSemanticUriFragment(targetLifeline));
      return this.edit(addMessageCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removeMessage(final UmlModelState modelState,
      final Message messageToRemove) {
      String semanticProxyUri = getSemanticUriFragment(messageToRemove);

      CCompoundCommand compoundCommand = RemoveMessageCommandContribution.create(semanticProxyUri);
      return this.edit(compoundCommand);
   }

   public CompletableFuture<Response<Boolean>> setMessageName(final UmlModelState modelState,
      final Message message, final String newName) {

      CCommand setMessageNameCommand = SetMessageNameCommandContribution.create(
         getSemanticUriFragment(message), newName);
      return this.edit(setMessageNameCommand);
   }

   public CompletableFuture<Response<Boolean>> copyInteraction(final List<InteractionCopyableProperties> properties) {
      var compoundCommand = CopyInteractionCommandContribution
         .create(properties);
      return this.edit(compoundCommand);
   }

   public CompletableFuture<Response<Boolean>> copyLifelineWithMessages(
      final List<LifelineCopyableProperties> lifelineProperties,
      final List<MessageCopyableProperties> messageProperties, final Interaction parentInteraction) {
      var compoundCommand = CopyLifelineWithMessagesCommandContribution
         .create(lifelineProperties, messageProperties, parentInteraction);
      return this.edit(compoundCommand);
   }
}
