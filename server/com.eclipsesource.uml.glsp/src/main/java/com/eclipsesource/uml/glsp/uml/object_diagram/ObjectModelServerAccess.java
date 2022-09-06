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
package com.eclipsesource.uml.glsp.uml.object_diagram;

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
import org.eclipse.uml2.uml.Class;
import org.eclipse.uml2.uml.Comment;
import org.eclipse.uml2.uml.Constraint;
import org.eclipse.uml2.uml.Element;
import org.eclipse.uml2.uml.InstanceSpecification;
import org.eclipse.uml2.uml.NamedElement;
import org.eclipse.uml2.uml.Property;
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
import com.eclipsesource.uml.modelserver.commands.classdiagram.clazz.RemoveClassCommandContribution;
import com.eclipsesource.uml.modelserver.commands.commons.contributions.ChangeBoundsCommandContribution;
import com.eclipsesource.uml.modelserver.commands.commons.contributions.ChangeRoutingPointsCommandContribution;
import com.eclipsesource.uml.modelserver.commands.commons.contributions.RenameElementCommandContribution;
import com.eclipsesource.uml.modelserver.commands.objectdiagram.attribute.AddAttributeCommandContribution;
import com.eclipsesource.uml.modelserver.commands.objectdiagram.attribute.SetAttributeCommandContribution;
import com.eclipsesource.uml.modelserver.commands.objectdiagram.link.AddLinkCommandContribution;
import com.eclipsesource.uml.modelserver.commands.objectdiagram.object.AddObjectCommandContribution;
import com.eclipsesource.uml.modelserver.commands.objectdiagram.object.SetObjectNameCommandContribution;
import com.eclipsesource.uml.modelserver.unotation.Edge;
import com.eclipsesource.uml.modelserver.unotation.Shape;
import com.google.common.base.Preconditions;

public class ObjectModelServerAccess extends EMSModelServerAccess {

   private static final Logger LOGGER = Logger.getLogger(ObjectModelServerAccess.class);
   private final UmlModelServerClient modelServerClient;
   protected String notationFileExtension;

   public ObjectModelServerAccess(final String sourceURI, final UmlModelServerClient modelServerClient) {
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
    * OBJECT
    */
   public CompletableFuture<Response<Boolean>> addObject(final UmlModelState modelState,
      final Optional<GPoint> newPosition) {
      CCompoundCommand addObjectCompoundCommand = AddObjectCommandContribution
         .create(newPosition.orElse(GraphUtil.point(0, 0)));
      return this.edit(addObjectCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removeObject(final UmlModelState modelState,
      final NamedElement objectToRemove) {

      String semanticProxyUri = getSemanticUriFragment(objectToRemove);
      CCompoundCommand compoundCommand = RemoveClassCommandContribution.create(semanticProxyUri);
      return this.edit(compoundCommand);
   }

   public CompletableFuture<Response<Boolean>> setObjectName(final UmlModelState modelState,
      final InstanceSpecification objectToRename, final String newName) {

      CCommand setObjectNameCommand = SetObjectNameCommandContribution.create(getSemanticUriFragment(objectToRename),
         newName);
      return this.edit(setObjectNameCommand);
   }

   /*
    * ATTRIBUTE
    */
   public CompletableFuture<Response<Boolean>> addAttribute(final UmlModelState modelState,
      final Class parentClass) {

      CCommand addAttributeCommand = AddAttributeCommandContribution.create(getSemanticUriFragment(parentClass));
      return this.edit(addAttributeCommand);
   }

   public CompletableFuture<Response<Boolean>> setAttribute(final UmlModelState modelState,
      final Property attributeToRename, final String newName, final String newType, final String newBounds) {

      CCommand setPropertyNameCommand = SetAttributeCommandContribution
         .create(getSemanticUriFragment(attributeToRename), newName, newType, newBounds);
      return this.edit(setPropertyNameCommand);
   }

   /*
    * LINK
    */
   public CompletableFuture<Response<Boolean>> addLink(final UmlModelState modelState,
      final Class sourceClass, final Class targetClass) {
      CCompoundCommand addLinkCompoundCommand = AddLinkCommandContribution
         .create(getSemanticUriFragment(sourceClass), getSemanticUriFragment(targetClass));
      return this.edit(addLinkCompoundCommand);
   }

}
