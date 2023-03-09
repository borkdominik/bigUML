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
package com.eclipsesource.uml.glsp.old.diagram.statemachine_diagram;

public class StateMachineModelServerAccess {

   /*-
   // ================== CONTENT =================
   /*
    * STATE MACHINE DIAGRAM
    *
   // STATE MACHINE
   public CompletableFuture<Response<String>> addStateMachine(final UmlModelState modelState,
      final Optional<GPoint> newPosition) {
   
      CCompoundCommand addStateMachineCompoundCommand = AddStateMachineCommandContribution
         .create(newPosition.orElse(GraphUtil.point(0, 0)));
      return this.edit(addStateMachineCompoundCommand);
   }
   
   public CompletableFuture<Response<String>> removeStateMachine(final UmlModelState modelState,
      final StateMachine stateMachineToRemove) {
   
      String semanticProxyUri = getSemanticUriFragment(stateMachineToRemove);
      CCompoundCommand compoundCommand = RemoveStateMachineCommandContribution.create(semanticProxyUri);
      return this.edit(compoundCommand);
   }
   
   public CompletableFuture<Response<String>> setStateMachineName(final UmlModelState modelState,
      final Class classToRename, final String newName) {
   
      CCommand setStateMachineNameCommand = SetStateMachineNameCommandContribution.create(
         getSemanticUriFragment(classToRename),
         newName);
      return this.edit(setStateMachineNameCommand);
   }
   
   // REGION
   public CompletableFuture<Response<String>> addRegion(final UmlModelState modelState,
      final NamedElement parent,
      final Optional<GPoint> newPosition) {
      System.out.println("MODELSERVER ACCESS");
      CCommand addRegionCompoundCommand = AddRegionCommandContribution.create(newPosition.orElse(GraphUtil.point(0, 0)),
         getSemanticUriFragment(parent));
      return this.edit(addRegionCompoundCommand);
   }
   
   // STATE
   public CompletableFuture<Response<String>> addState(final UmlModelState modelState,
      final NamedElement parentRegion,
      final Optional<GPoint> newPosition) {
   
      CCommand addStateCompoundCommand = AddStateCommandContribution.create(getSemanticUriFragment(parentRegion),
         newPosition.orElse(GraphUtil.point(0, 0)));
      return this.edit(addStateCompoundCommand);
   }
   
   public CompletableFuture<Response<String>> removeState(final UmlModelState modelState,
      final State stateToRemove) {
   
      Region parentRegion = (Region) stateToRemove.eContainer();
      CCompoundCommand compoundCommand = RemoveStateCommandContribution.create(getSemanticUriFragment(parentRegion),
         getSemanticUriFragment(stateToRemove));
      return this.edit(compoundCommand);
   }
   
   public CompletableFuture<Response<String>> setStateName(final UmlModelState modelState,
      final State stateToRename, final String newName) {
      CCommand setStateNameCommand = SetStateNameCommandContribution.create(getSemanticUriFragment(stateToRename),
         newName);
      return this.edit(setStateNameCommand);
   }
   
   // PSEUDOSTATE
   public CompletableFuture<Response<String>> addPseudostate(final UmlModelState modelState,
      final Region parentRegion,
      final PseudostateKind pseudostateKind,
      final Optional<GPoint> newPosition) {
      CCommand addPseudostateCompoundCommand = AddPseudoStateCommandContribution
         .create(getSemanticUriFragment(parentRegion), pseudostateKind, newPosition.orElse(GraphUtil.point(0, 0)));
      return this.edit(addPseudostateCompoundCommand);
   }
   
   public CompletableFuture<Response<String>> removePseudostate(final UmlModelState modelState,
      final Pseudostate pseudostateToRemove) {
   
      NamedElement parentContainer = (NamedElement) pseudostateToRemove.eContainer();
      CCompoundCommand compoundCommand = RemovePseudoStateCommandContribution.create(
         getSemanticUriFragment(parentContainer),
         getSemanticUriFragment(pseudostateToRemove));
      return this.edit(compoundCommand);
   }
   
   public CompletableFuture<Response<String>> setPseudostateName(final UmlModelState modelState,
      final Pseudostate pseudostateToRename, final String newName) {
   
      CCommand setPseudostateNameCommand = SetPseudostateNameCommandContribution
         .create(getSemanticUriFragment(pseudostateToRename), newName);
   
      return this.edit(setPseudostateNameCommand);
   }
   
   // FINAL STATE
   public CompletableFuture<Response<String>> addFinalState(final UmlModelState modelState,
      final Region parentRegion,
      final Optional<GPoint> newPosition) {
   
      CCompoundCommand addFinalStateCompoundCommand = AddFinalStateCommandContribution
         .create(getSemanticUriFragment(parentRegion), newPosition.orElse(GraphUtil.point(0, 0)));
   
      return this.edit(addFinalStateCompoundCommand);
   }
   
   public CompletableFuture<Response<String>> removeFinalState(final UmlModelState modelState,
      final FinalState finalStateToRemove) {
   
      NamedElement containerRegion = (Region) finalStateToRemove.eContainer();
      CCompoundCommand compoundCommand = RemoveFinalStateCommandContribution.create(
         getSemanticUriFragment(containerRegion),
         getSemanticUriFragment(finalStateToRemove));
   
      return this.edit(compoundCommand);
   }
   
   // BEHAVIOUR IN STATE
   public CompletableFuture<Response<String>> addBehaviorToState(final UmlModelState modelState,
      final State parentState, final String activityType) {
   
      CCommand addBehaviorToStateCompoundCommand = AddBehaviorToStateCommandContribution
         .create(getSemanticUriFragment(parentState), activityType);
      return this.edit(addBehaviorToStateCompoundCommand);
   }
   
   public CompletableFuture<Response<String>> setBehaviorInState(final UmlModelState modelState,
      final Behavior behaviorToRename, final String behaviorType, final String newName) {
   
      CCommand setBehaviorInStateCommand = SetBehaviorInStateCommandContribution
         .create(getSemanticUriFragment(behaviorToRename), behaviorType, newName);
      return this.edit(setBehaviorInStateCommand);
   }
   
   public CompletableFuture<Response<String>> removeBehaviorFromState(final UmlModelState modelState,
      final Behavior behaviorToRemove) {
   
      State parentState = (State) behaviorToRemove.eContainer();
      CCommand removeBehaviorFromStateCommand = RemoveBehaviorFromStateCommandContribution
         .create(getSemanticUriFragment(parentState), getSemanticUriFragment(behaviorToRemove));
      return this.edit(removeBehaviorFromStateCommand);
   }
   
   // TRANSITION
   public CompletableFuture<Response<String>> addTransition(final UmlModelState modelState,
      final Vertex source, final Vertex target) {
   
      Region parentRegion = (Region) source.eContainer();
      CCompoundCommand addTransitionCompoundCommand = AddTransitionCommandContribution
         .create(getSemanticUriFragment(parentRegion), getSemanticUriFragment(source), getSemanticUriFragment(target));
   
      return this.edit(addTransitionCompoundCommand);
   }
   
   public CompletableFuture<Response<String>> removeTransition(final UmlModelState modelState,
      final Transition transition) {
   
      Region parentRegion = (Region) transition.eContainer();
      CCommand removeTransitionCommand = RemoveTransitionCommandContribution
         .create(getSemanticUriFragment(parentRegion), getSemanticUriFragment(transition));
   
      return this.edit(removeTransitionCommand);
   }
   
   public CompletableFuture<Response<String>> addTransitionLabel(final UmlModelState modelState,
      final Transition transition, final String newValue) {
   
      CCommand addTransitionLabelCommand = AddTransitionLabelCommandContribution.create(
         getSemanticUriFragment(transition),
         newValue);
   
      return this.edit(addTransitionLabelCommand);
   
   }
   
   public CompletableFuture<Response<String>> addTransitionGuard(final UmlModelState modelState,
      final Transition transition, final String newValue) {
   
      CCommand addTransitionGuardCommand = AddTransitionGuardCommandContribution.create(
         getSemanticUriFragment(transition),
         newValue);
   
      return this.edit(addTransitionGuardCommand);
   
   }
   
   public CompletableFuture<Response<String>> addTransitionEffect(final UmlModelState modelState,
      final Transition transition, final String newValue) {
   
      CCommand addTransitionEffectCommand = AddTransitionEffectCommandContribution.create(
         getSemanticUriFragment(transition),
         newValue);
   
      return this.edit(addTransitionEffectCommand);
   
   }
   
   public CompletableFuture<Response<String>> addTransitionTrigger(final UmlModelState modelState,
      final Transition transition, final String newValue) {
   
      CCommand addTransitionTriggerCommand = AddTransitionTriggerCommandContribution.create(
         getSemanticUriFragment(transition),
         newValue);
   
      return this.edit(addTransitionTriggerCommand);
   
   }
   */
}
