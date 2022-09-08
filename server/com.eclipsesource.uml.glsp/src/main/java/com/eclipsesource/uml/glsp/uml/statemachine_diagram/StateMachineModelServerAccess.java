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
package com.eclipsesource.uml.glsp.uml.statemachine_diagram;

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
import org.eclipse.uml2.uml.Behavior;
import org.eclipse.uml2.uml.Class;
import org.eclipse.uml2.uml.Comment;
import org.eclipse.uml2.uml.Constraint;
import org.eclipse.uml2.uml.Element;
import org.eclipse.uml2.uml.FinalState;
import org.eclipse.uml2.uml.NamedElement;
import org.eclipse.uml2.uml.Pseudostate;
import org.eclipse.uml2.uml.PseudostateKind;
import org.eclipse.uml2.uml.Region;
import org.eclipse.uml2.uml.State;
import org.eclipse.uml2.uml.StateMachine;
import org.eclipse.uml2.uml.Transition;
import org.eclipse.uml2.uml.Vertex;
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
import com.eclipsesource.uml.modelserver.commands.statemachinediagram.finalstate.AddFinalStateCommandContribution;
import com.eclipsesource.uml.modelserver.commands.statemachinediagram.finalstate.RemoveFinalStateCommandContribution;
import com.eclipsesource.uml.modelserver.commands.statemachinediagram.pseudostate.AddPseudoStateCommandContribution;
import com.eclipsesource.uml.modelserver.commands.statemachinediagram.pseudostate.RemovePseudoStateCommandContribution;
import com.eclipsesource.uml.modelserver.commands.statemachinediagram.pseudostate.SetPseudostateNameCommandContribution;
import com.eclipsesource.uml.modelserver.commands.statemachinediagram.region.AddRegionCommandContribution;
import com.eclipsesource.uml.modelserver.commands.statemachinediagram.state.AddStateCommandContribution;
import com.eclipsesource.uml.modelserver.commands.statemachinediagram.state.RemoveStateCommandContribution;
import com.eclipsesource.uml.modelserver.commands.statemachinediagram.state.SetStateNameCommandContribution;
import com.eclipsesource.uml.modelserver.commands.statemachinediagram.statebehavior.AddBehaviorToStateCommandContribution;
import com.eclipsesource.uml.modelserver.commands.statemachinediagram.statebehavior.RemoveBehaviorFromStateCommandContribution;
import com.eclipsesource.uml.modelserver.commands.statemachinediagram.statebehavior.SetBehaviorInStateCommandContribution;
import com.eclipsesource.uml.modelserver.commands.statemachinediagram.statemachine.AddStateMachineCommandContribution;
import com.eclipsesource.uml.modelserver.commands.statemachinediagram.statemachine.RemoveStateMachineCommandContribution;
import com.eclipsesource.uml.modelserver.commands.statemachinediagram.statemachine.SetStateMachineNameCommandContribution;
import com.eclipsesource.uml.modelserver.commands.statemachinediagram.transition.AddTransitionCommandContribution;
import com.eclipsesource.uml.modelserver.commands.statemachinediagram.transition.RemoveTransitionCommandContribution;
import com.eclipsesource.uml.modelserver.commands.statemachinediagram.transition.specific.AddTransitionEffectCommandContribution;
import com.eclipsesource.uml.modelserver.commands.statemachinediagram.transition.specific.AddTransitionGuardCommandContribution;
import com.eclipsesource.uml.modelserver.commands.statemachinediagram.transition.specific.AddTransitionLabelCommandContribution;
import com.eclipsesource.uml.modelserver.commands.statemachinediagram.transition.specific.AddTransitionTriggerCommandContribution;
import com.eclipsesource.uml.modelserver.unotation.Edge;
import com.eclipsesource.uml.modelserver.unotation.Shape;
import com.google.common.base.Preconditions;

public class StateMachineModelServerAccess extends EMSModelServerAccess {

   private static final Logger LOGGER = Logger.getLogger(StateMachineModelServerAccess.class);
   private final UmlModelServerClient modelServerClient;
   protected String notationFileExtension;

   public StateMachineModelServerAccess(final String sourceURI, final UmlModelServerClient modelServerClient) {
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
    * STATE MACHINE DIAGRAM
    */
   // STATE MACHINE
   public CompletableFuture<Response<Boolean>> addStateMachine(final UmlModelState modelState,
      final Optional<GPoint> newPosition) {

      CCompoundCommand addStateMachineCompoundCommand = AddStateMachineCommandContribution
         .create(newPosition.orElse(GraphUtil.point(0, 0)));
      return this.edit(addStateMachineCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removeStateMachine(final UmlModelState modelState,
      final StateMachine stateMachineToRemove) {

      String semanticProxyUri = getSemanticUriFragment(stateMachineToRemove);
      CCompoundCommand compoundCommand = RemoveStateMachineCommandContribution.create(semanticProxyUri);
      return this.edit(compoundCommand);
   }

   public CompletableFuture<Response<Boolean>> setStateMachineName(final UmlModelState modelState,
      final Class classToRename, final String newName) {

      CCommand setStateMachineNameCommand = SetStateMachineNameCommandContribution.create(
         getSemanticUriFragment(classToRename),
         newName);
      return this.edit(setStateMachineNameCommand);
   }

   // REGION
   public CompletableFuture<Response<Boolean>> addRegion(final UmlModelState modelState,
      final NamedElement parent,
      final Optional<GPoint> newPosition) {
      System.out.println("MODELSERVER ACCESS");
      CCommand addRegionCompoundCommand = AddRegionCommandContribution.create(newPosition.orElse(GraphUtil.point(0, 0)),
         getSemanticUriFragment(parent));
      return this.edit(addRegionCompoundCommand);
   }

   // STATE
   public CompletableFuture<Response<Boolean>> addState(final UmlModelState modelState,
      final NamedElement parentRegion,
      final Optional<GPoint> newPosition) {

      CCommand addStateCompoundCommand = AddStateCommandContribution.create(getSemanticUriFragment(parentRegion),
         newPosition.orElse(GraphUtil.point(0, 0)));
      return this.edit(addStateCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removeState(final UmlModelState modelState,
      final State stateToRemove) {

      Region parentRegion = (Region) stateToRemove.eContainer();
      CCompoundCommand compoundCommand = RemoveStateCommandContribution.create(getSemanticUriFragment(parentRegion),
         getSemanticUriFragment(stateToRemove));
      return this.edit(compoundCommand);
   }

   public CompletableFuture<Response<Boolean>> setStateName(final UmlModelState modelState,
      final State stateToRename, final String newName) {
      CCommand setStateNameCommand = SetStateNameCommandContribution.create(getSemanticUriFragment(stateToRename),
         newName);
      return this.edit(setStateNameCommand);
   }

   // PSEUDOSTATE
   public CompletableFuture<Response<Boolean>> addPseudostate(final UmlModelState modelState,
      final Region parentRegion,
      final PseudostateKind pseudostateKind,
      final Optional<GPoint> newPosition) {
      CCommand addPseudostateCompoundCommand = AddPseudoStateCommandContribution
         .create(getSemanticUriFragment(parentRegion), pseudostateKind, newPosition.orElse(GraphUtil.point(0, 0)));
      return this.edit(addPseudostateCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removePseudostate(final UmlModelState modelState,
      final Pseudostate pseudostateToRemove) {

      NamedElement parentContainer = (NamedElement) pseudostateToRemove.eContainer();
      CCompoundCommand compoundCommand = RemovePseudoStateCommandContribution.create(
         getSemanticUriFragment(parentContainer),
         getSemanticUriFragment(pseudostateToRemove));
      return this.edit(compoundCommand);
   }

   public CompletableFuture<Response<Boolean>> setPseudostateName(final UmlModelState modelState,
      final Pseudostate pseudostateToRename, final String newName) {

      CCommand setPseudostateNameCommand = SetPseudostateNameCommandContribution
         .create(getSemanticUriFragment(pseudostateToRename), newName);

      return this.edit(setPseudostateNameCommand);
   }

   // FINAL STATE
   public CompletableFuture<Response<Boolean>> addFinalState(final UmlModelState modelState,
      final Region parentRegion,
      final Optional<GPoint> newPosition) {

      CCompoundCommand addFinalStateCompoundCommand = AddFinalStateCommandContribution
         .create(getSemanticUriFragment(parentRegion), newPosition.orElse(GraphUtil.point(0, 0)));

      return this.edit(addFinalStateCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removeFinalState(final UmlModelState modelState,
      final FinalState finalStateToRemove) {

      NamedElement containerRegion = (Region) finalStateToRemove.eContainer();
      CCompoundCommand compoundCommand = RemoveFinalStateCommandContribution.create(
         getSemanticUriFragment(containerRegion),
         getSemanticUriFragment(finalStateToRemove));

      return this.edit(compoundCommand);
   }

   // BEHAVIOUR IN STATE
   public CompletableFuture<Response<Boolean>> addBehaviorToState(final UmlModelState modelState,
      final State parentState, final String activityType) {

      CCommand addBehaviorToStateCompoundCommand = AddBehaviorToStateCommandContribution
         .create(getSemanticUriFragment(parentState), activityType);
      return this.edit(addBehaviorToStateCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> setBehaviorInState(final UmlModelState modelState,
      final Behavior behaviorToRename, final String behaviorType, final String newName) {

      CCommand setBehaviorInStateCommand = SetBehaviorInStateCommandContribution
         .create(getSemanticUriFragment(behaviorToRename), behaviorType, newName);
      return this.edit(setBehaviorInStateCommand);
   }

   public CompletableFuture<Response<Boolean>> removeBehaviorFromState(final UmlModelState modelState,
      final Behavior behaviorToRemove) {

      State parentState = (State) behaviorToRemove.eContainer();
      CCommand removeBehaviorFromStateCommand = RemoveBehaviorFromStateCommandContribution
         .create(getSemanticUriFragment(parentState), getSemanticUriFragment(behaviorToRemove));
      return this.edit(removeBehaviorFromStateCommand);
   }

   // TRANSITION
   public CompletableFuture<Response<Boolean>> addTransition(final UmlModelState modelState,
      final Vertex source, final Vertex target) {

      Region parentRegion = (Region) source.eContainer();
      CCompoundCommand addTransitionCompoundCommand = AddTransitionCommandContribution
         .create(getSemanticUriFragment(parentRegion), getSemanticUriFragment(source), getSemanticUriFragment(target));

      return this.edit(addTransitionCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removeTransition(final UmlModelState modelState,
      final Transition transition) {

      Region parentRegion = (Region) transition.eContainer();
      CCommand removeTransitionCommand = RemoveTransitionCommandContribution
         .create(getSemanticUriFragment(parentRegion), getSemanticUriFragment(transition));

      return this.edit(removeTransitionCommand);
   }

   public CompletableFuture<Response<Boolean>> addTransitionLabel(final UmlModelState modelState,
      final Transition transition, final String newValue) {

      CCommand addTransitionLabelCommand = AddTransitionLabelCommandContribution.create(
         getSemanticUriFragment(transition),
         newValue);

      return this.edit(addTransitionLabelCommand);

   }

   public CompletableFuture<Response<Boolean>> addTransitionGuard(final UmlModelState modelState,
      final Transition transition, final String newValue) {

      CCommand addTransitionGuardCommand = AddTransitionGuardCommandContribution.create(
         getSemanticUriFragment(transition),
         newValue);

      return this.edit(addTransitionGuardCommand);

   }

   public CompletableFuture<Response<Boolean>> addTransitionEffect(final UmlModelState modelState,
      final Transition transition, final String newValue) {

      CCommand addTransitionEffectCommand = AddTransitionEffectCommandContribution.create(
         getSemanticUriFragment(transition),
         newValue);

      return this.edit(addTransitionEffectCommand);

   }

   public CompletableFuture<Response<Boolean>> addTransitionTrigger(final UmlModelState modelState,
      final Transition transition, final String newValue) {

      CCommand addTransitionTriggerCommand = AddTransitionTriggerCommandContribution.create(
         getSemanticUriFragment(transition),
         newValue);

      return this.edit(addTransitionTriggerCommand);

   }

}
