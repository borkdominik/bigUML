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

public class ActivityModelServerAccess {
   /*-
   
   /*
    * Types
    *
   public CompletableFuture<Response<List<String>>> getUmlTypes() {
      return this.modelServerClient.getUmlTypes(getSemanticURI());
   }
   
   // FIXME
   public CompletableFuture<Response<List<String>>> getUmlBehaviors() {
      // return this.modelServerClient.getUmlBehaviors(getSemanticURI());
      return null;
   }
   
   /*
    * ACTIVITY
    *
   public CompletableFuture<Response<String>> addActivity(final UmlModelState modelState,
      final Optional<GPoint> newPosition) {
   
      CCompoundCommand addActivityCompoundCommand = AddActivityCommandContribution
         .create(newPosition.orElse(GraphUtil.point(0, 0)));
      return this.edit(addActivityCompoundCommand);
   }
   
   public CompletableFuture<Response<String>> removeActivity(final UmlModelState modelState,
      final Activity activity) {
      CCommand removePropertyCommand = RemoveActivityCommandContribution
         .create(getSemanticUriFragment(activity));
      return this.edit(removePropertyCommand);
   }
   
   /*
    * Partition
    *
   public CompletableFuture<Response<String>> addPartition(final UmlModelState modelState,
      final Optional<GPoint> position,
      final NamedElement parent) {
      CCompoundCommand addPartitionCompoundCommand = AddPartitionCommandContribution
         .create(position.orElse(GraphUtil.point(0, 0)), getSemanticUriFragment(parent));
      return this.edit(addPartitionCompoundCommand);
   }
   
   public CompletableFuture<Response<String>> removeActivityGroup(final UmlModelState modelState,
      final ActivityGroup group) {
      CCommand removePropertyCommand = RemovePartitionCommandContribution
         .create(getSemanticUriFragment(group.getOwner()), getSemanticUriFragment(group));
      return this.edit(removePropertyCommand);
   }
   
   public CompletableFuture<Response<String>> setBehavior(final UmlModelState modelState,
      final CallBehaviorAction cba, final String behavior) {
   
      CCommand renameameCommand = SetBehaviorCommandContribution.create(getSemanticUriFragment(cba),
         behavior);
      return this.edit(renameameCommand);
   }
   
   /*
    * UML Action
    *
   public CompletableFuture<Response<String>> addAction(final UmlModelState modelState,
      final Optional<GPoint> newPosition,
      final EObject parent,
      final java.lang.Class<? extends Action> clazz) {
   
      CCompoundCommand addActivityCompoundCommand = AddActionCommandContribution
         .create(newPosition.orElse(GraphUtil.point(0, 0)), getSemanticUriFragment(parent), clazz);
      return this.edit(addActivityCompoundCommand);
   }
   
   public CompletableFuture<Response<String>> addEventAction(final UmlModelState modelState,
      final Optional<GPoint> newPosition,
      final EObject parent, final boolean isTimeEvent) {
   
      CCompoundCommand addActivityCompoundCommand = AddActionCommandContribution
         .create(newPosition.orElse(GraphUtil.point(0, 0)), getSemanticUriFragment(parent), isTimeEvent);
      return this.edit(addActivityCompoundCommand);
   }
   
   public CompletableFuture<Response<String>> removeActivityNode(final UmlModelState modelState,
      final ActivityNode node) {
      Activity activity = node.getActivity();
   
      CCommand removePropertyCommand = RemoveActivityNodeCommandContribution
         .create(getSemanticUriFragment(activity), getSemanticUriFragment(node));
      return this.edit(removePropertyCommand);
   }
   
   /*
    * Control Nodes
    *
   public CompletableFuture<Response<String>> addControlNode(final UmlModelState modelState,
      final Optional<GPoint> newPosition,
      final EObject parent,
      final java.lang.Class<? extends ControlNode> clazz) {
   
      CCompoundCommand addActivityCompoundCommand = AddControlNodeCommandContribution
         .create(newPosition.orElse(GraphUtil.point(0, 0)), getSemanticUriFragment(parent), clazz);
      return this.edit(addActivityCompoundCommand);
   }
   
   /*
    * UML ControlFlow
    *
   public CompletableFuture<Response<String>> addControlflow(final UmlModelState modelState,
      final ActivityNode source, final ActivityNode target) {
   
      CCompoundCommand addControlflowCompoundCommand = AddControlFLowCommandContribution
         .create(getSemanticUriFragment(source), getSemanticUriFragment(target));
      return this.edit(addControlflowCompoundCommand);
   }
   
   public CompletableFuture<Response<String>> removeActivityEdge(final UmlModelState modelState,
      final ActivityEdge edge) {
      Activity activity = edge.getActivity();
   
      CCommand removePropertyCommand = RemoveActivityEdgeCommandContribution
         .create(getSemanticUriFragment(activity), getSemanticUriFragment(edge));
      return this.edit(removePropertyCommand);
   }
   
   public CompletableFuture<Response<String>> setGuard(final UmlModelState modelState,
      final ControlFlow controlFlow, final String newValue) {
   
      CCommand setGuardCommand = SetGuardCommandContribution.create(getSemanticUriFragment(controlFlow), newValue);
      return this.edit(setGuardCommand);
   
   }
   
   public CompletableFuture<Response<String>> setWeight(final UmlModelState modelState,
      final ControlFlow controlFlow, final String newValue) {
   
      CCommand setGuardCommand = SetWeightCommandContribution.create(getSemanticUriFragment(controlFlow), newValue);
      return this.edit(setGuardCommand);
   
   }
   
   /*
    * UML ExceptionHandler
    *
   public CompletableFuture<Response<String>> addExceptionHandler(final UmlModelState modelState,
      final ExecutableNode source, final Pin target) {
   
      CCompoundCommand addControlflowCompoundCommand = AddExceptionHandlerCommandContribution
         .create(getSemanticUriFragment(source), getSemanticUriFragment(target));
      return this.edit(addControlflowCompoundCommand);
   }
   
   public CompletableFuture<Response<String>> removeExceptionHandler(final UmlModelState modelState,
      final ExceptionHandler handler) {
      CCommand removePropertyCommand = RemoveExceptionHandlerCommandContribution
         .create(getSemanticUriFragment(handler));
      return this.edit(removePropertyCommand);
   }
   
   public CompletableFuture<Response<String>> addInterruptibleRegion(final UmlModelState modelState,
      final Optional<GPoint> position,
      final EObject parent) {
   
      CCompoundCommand addPartitionCompoundCommand = AddInterruptibleRegionCommandContribution
         .create(position.orElse(GraphUtil.point(0, 0)), getSemanticUriFragment(parent));
      return this.edit(addPartitionCompoundCommand);
   }
   
   /*
    * public CompletableFuture<Response<String>> removeInterruptibleRegion(final UmlModelState modelState,
    * final InterruptibleActivityRegion region) {
    * CCommand removePropertyCommand = RemoveInterruptibleRegionCommandContribution
    * .create(getSemanticUriFragment(region));
    * return this.edit(removePropertyCommand);
    * }
    *
   
   /*
    * UML Data Flow
    *
   public CompletableFuture<Response<String>> addParameter(final UmlModelState modelState,
      final Optional<GPoint> newPosition,
      final Activity activity) {
      CCompoundCommand addPartitionCompoundCommand = AddParameterCommandContribution
         .create(newPosition.orElse(GraphUtil.point(0, 0)), getSemanticUriFragment(activity));
      return this.edit(addPartitionCompoundCommand);
   }
   
   public CompletableFuture<Response<String>> addPin(final UmlModelState modelState, final Action action) {
      CCompoundCommand addPartitionCompoundCommand = AddPinCommandContribution
         .create(getSemanticUriFragment(action));
      return this.edit(addPartitionCompoundCommand);
   }
   
   public CompletableFuture<Response<String>> addObjectNode(final UmlModelState modelState,
      final Optional<GPoint> newPosition,
      final Element parent,
      final java.lang.Class<? extends ObjectNode> clazz) {
      CCompoundCommand addActivityCompoundCommand = AddObjectNodeCommandContribution
         .create(newPosition.orElse(GraphUtil.point(0, 0)), getSemanticUriFragment(parent), clazz);
      return this.edit(addActivityCompoundCommand);
   }
   */
}
