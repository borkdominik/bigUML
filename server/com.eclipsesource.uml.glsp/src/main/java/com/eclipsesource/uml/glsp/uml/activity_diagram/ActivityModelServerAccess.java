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
package com.eclipsesource.uml.glsp.uml.activity_diagram;

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
import org.eclipse.uml2.uml.Action;
import org.eclipse.uml2.uml.Activity;
import org.eclipse.uml2.uml.ActivityEdge;
import org.eclipse.uml2.uml.ActivityGroup;
import org.eclipse.uml2.uml.ActivityNode;
import org.eclipse.uml2.uml.CallBehaviorAction;
import org.eclipse.uml2.uml.Constraint;
import org.eclipse.uml2.uml.ControlFlow;
import org.eclipse.uml2.uml.ControlNode;
import org.eclipse.uml2.uml.Element;
import org.eclipse.uml2.uml.ExceptionHandler;
import org.eclipse.uml2.uml.ExecutableNode;
import org.eclipse.uml2.uml.NamedElement;
import org.eclipse.uml2.uml.ObjectNode;
import org.eclipse.uml2.uml.Pin;
import org.eclipse.uml2.uml.resource.UMLResource;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.modelserver.UmlModelServerClient;
import com.eclipsesource.uml.modelserver.UmlNotationUtil;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.action.AddActionCommandContribution;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.action.SetBehaviorCommandContribution;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.activity.AddActivityCommandContribution;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.activity.RemoveActivityCommandContribution;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.condition.AddConditionCommandContribution;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.controlnode.AddControlNodeCommandContribution;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.datanode.AddObjectNodeCommandContribution;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.datanode.AddParameterCommandContribution;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.datanode.AddPinCommandContribution;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.exceptionhandler.AddExceptionHandlerCommandContribution;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.exceptionhandler.RemoveExceptionHandlerCommandContribution;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.flow.AddControlFLowCommandContribution;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.flow.RemoveActivityEdgeCommandContribution;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.flow.SetGuardCommandContribution;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.flow.SetWeightCommandContribution;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.general.RemoveActivityNodeCommandContribution;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.interruptibleregion.AddInterruptibleRegionCommandContribution;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.partition.AddPartitionCommandContribution;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.partition.RemovePartitionCommandContribution;
import com.eclipsesource.uml.modelserver.commands.commons.contributions.ChangeBoundsCommandContribution;
import com.eclipsesource.uml.modelserver.commands.commons.contributions.ChangeRoutingPointsCommandContribution;
import com.eclipsesource.uml.modelserver.commands.commons.contributions.RenameElementCommandContribution;
import com.eclipsesource.uml.modelserver.unotation.Edge;
import com.eclipsesource.uml.modelserver.unotation.Shape;
import com.google.common.base.Preconditions;

public class ActivityModelServerAccess extends EMSModelServerAccess {

   private static final Logger LOGGER = Logger.getLogger(ActivityModelServerAccess.class);
   private final UmlModelServerClient modelServerClient;
   protected String notationFileExtension;

   public ActivityModelServerAccess(final String sourceURI, final UmlModelServerClient modelServerClient) {
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

      // TODO: Why is activity uml only using this?
      /*
       * CCommand renameameCommand = SetBodyCommandContribution.create(getSemanticUriFragment(constraint),
       * body);
       * return this.edit(renameameCommand);
       */
      return null;
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
    * ACTIVITY
    */
   public CompletableFuture<Response<Boolean>> addActivity(final UmlModelState modelState,
      final Optional<GPoint> newPosition) {

      CCompoundCommand addActivityCompoundCommand = AddActivityCommandContribution
         .create(newPosition.orElse(GraphUtil.point(0, 0)));
      return this.edit(addActivityCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removeActivity(final UmlModelState modelState,
      final Activity activity) {
      CCommand removePropertyCommand = RemoveActivityCommandContribution
         .create(getSemanticUriFragment(activity));
      return this.edit(removePropertyCommand);
   }

   /*
    * Partition
    */
   public CompletableFuture<Response<Boolean>> addPartition(final UmlModelState modelState,
      final Optional<GPoint> position,
      final NamedElement parent) {
      CCompoundCommand addPartitionCompoundCommand = AddPartitionCommandContribution
         .create(position.orElse(GraphUtil.point(0, 0)), getSemanticUriFragment(parent));
      return this.edit(addPartitionCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removeActivityGroup(final UmlModelState modelState,
      final ActivityGroup group) {
      CCommand removePropertyCommand = RemovePartitionCommandContribution
         .create(getSemanticUriFragment(group.getOwner()), getSemanticUriFragment(group));
      return this.edit(removePropertyCommand);
   }

   public CompletableFuture<Response<Boolean>> setBehavior(final UmlModelState modelState,
      final CallBehaviorAction cba, final String behavior) {

      CCommand renameameCommand = SetBehaviorCommandContribution.create(getSemanticUriFragment(cba),
         behavior);
      return this.edit(renameameCommand);
   }

   /*
    * UML Action
    */
   public CompletableFuture<Response<Boolean>> addAction(final UmlModelState modelState,
      final Optional<GPoint> newPosition,
      final EObject parent,
      final java.lang.Class<? extends Action> clazz) {

      CCompoundCommand addActivityCompoundCommand = AddActionCommandContribution
         .create(newPosition.orElse(GraphUtil.point(0, 0)), getSemanticUriFragment(parent), clazz);
      return this.edit(addActivityCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> addEventAction(final UmlModelState modelState,
      final Optional<GPoint> newPosition,
      final EObject parent, final boolean isTimeEvent) {

      CCompoundCommand addActivityCompoundCommand = AddActionCommandContribution
         .create(newPosition.orElse(GraphUtil.point(0, 0)), getSemanticUriFragment(parent), isTimeEvent);
      return this.edit(addActivityCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removeActivityNode(final UmlModelState modelState,
      final ActivityNode node) {
      Activity activity = node.getActivity();

      CCommand removePropertyCommand = RemoveActivityNodeCommandContribution
         .create(getSemanticUriFragment(activity), getSemanticUriFragment(node));
      return this.edit(removePropertyCommand);
   }

   /*
    * Control Nodes
    */
   public CompletableFuture<Response<Boolean>> addControlNode(final UmlModelState modelState,
      final Optional<GPoint> newPosition,
      final EObject parent,
      final java.lang.Class<? extends ControlNode> clazz) {

      CCompoundCommand addActivityCompoundCommand = AddControlNodeCommandContribution
         .create(newPosition.orElse(GraphUtil.point(0, 0)), getSemanticUriFragment(parent), clazz);
      return this.edit(addActivityCompoundCommand);
   }

   /*
    * UML ControlFlow
    */
   public CompletableFuture<Response<Boolean>> addControlflow(final UmlModelState modelState,
      final ActivityNode source, final ActivityNode target) {

      CCompoundCommand addControlflowCompoundCommand = AddControlFLowCommandContribution
         .create(getSemanticUriFragment(source), getSemanticUriFragment(target));
      return this.edit(addControlflowCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removeActivityEdge(final UmlModelState modelState,
      final ActivityEdge edge) {
      Activity activity = edge.getActivity();

      CCommand removePropertyCommand = RemoveActivityEdgeCommandContribution
         .create(getSemanticUriFragment(activity), getSemanticUriFragment(edge));
      return this.edit(removePropertyCommand);
   }

   public CompletableFuture<Response<Boolean>> setGuard(final UmlModelState modelState,
      final ControlFlow controlFlow, final String newValue) {

      CCommand setGuardCommand = SetGuardCommandContribution.create(getSemanticUriFragment(controlFlow), newValue);
      return this.edit(setGuardCommand);

   }

   public CompletableFuture<Response<Boolean>> setWeight(final UmlModelState modelState,
      final ControlFlow controlFlow, final String newValue) {

      CCommand setGuardCommand = SetWeightCommandContribution.create(getSemanticUriFragment(controlFlow), newValue);
      return this.edit(setGuardCommand);

   }

   /*
    * UML ExceptionHandler
    */
   public CompletableFuture<Response<Boolean>> addExceptionHandler(final UmlModelState modelState,
      final ExecutableNode source, final Pin target) {

      CCompoundCommand addControlflowCompoundCommand = AddExceptionHandlerCommandContribution
         .create(getSemanticUriFragment(source), getSemanticUriFragment(target));
      return this.edit(addControlflowCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removeExceptionHandler(final UmlModelState modelState,
      final ExceptionHandler handler) {
      CCommand removePropertyCommand = RemoveExceptionHandlerCommandContribution
         .create(getSemanticUriFragment(handler));
      return this.edit(removePropertyCommand);
   }

   public CompletableFuture<Response<Boolean>> addInterruptibleRegion(final UmlModelState modelState,
      final Optional<GPoint> position,
      final EObject parent) {

      CCompoundCommand addPartitionCompoundCommand = AddInterruptibleRegionCommandContribution
         .create(position.orElse(GraphUtil.point(0, 0)), getSemanticUriFragment(parent));
      return this.edit(addPartitionCompoundCommand);
   }

   /*
    * public CompletableFuture<Response<Boolean>> removeInterruptibleRegion(final UmlModelState modelState,
    * final InterruptibleActivityRegion region) {
    * CCommand removePropertyCommand = RemoveInterruptibleRegionCommandContribution
    * .create(getSemanticUriFragment(region));
    * return this.edit(removePropertyCommand);
    * }
    */

   /*
    * UML Data Flow
    */
   public CompletableFuture<Response<Boolean>> addParameter(final UmlModelState modelState,
      final Optional<GPoint> newPosition,
      final Activity activity) {
      CCompoundCommand addPartitionCompoundCommand = AddParameterCommandContribution
         .create(newPosition.orElse(GraphUtil.point(0, 0)), getSemanticUriFragment(activity));
      return this.edit(addPartitionCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> addPin(final UmlModelState modelState, final Action action) {
      CCompoundCommand addPartitionCompoundCommand = AddPinCommandContribution
         .create(getSemanticUriFragment(action));
      return this.edit(addPartitionCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> addObjectNode(final UmlModelState modelState,
      final Optional<GPoint> newPosition,
      final Element parent,
      final java.lang.Class<? extends ObjectNode> clazz) {
      CCompoundCommand addActivityCompoundCommand = AddObjectNodeCommandContribution
         .create(newPosition.orElse(GraphUtil.point(0, 0)), getSemanticUriFragment(parent), clazz);
      return this.edit(addActivityCompoundCommand);
   }
}
