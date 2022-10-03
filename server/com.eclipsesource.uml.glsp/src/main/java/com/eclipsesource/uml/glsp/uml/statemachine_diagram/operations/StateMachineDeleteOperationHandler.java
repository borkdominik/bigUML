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
package com.eclipsesource.uml.glsp.uml.statemachine_diagram.operations;

public class StateMachineDeleteOperationHandler { /*-

   protected UmlModelState getUmlModelState() { return (UmlModelState) getEMSModelState(); }

   @Override
   public void executeOperation(final DeleteOperation operation, final StateMachineModelServerAccess modelAccess) {
      UmlModelState modelState = getUmlModelState();

      Representation diagramType = UmlModelState.getModelState(modelState).getNotationModel().getDiagramType();

      operation.getElementIds().forEach(elementId -> {

         boolean removeTransitionGuard = false;
         boolean removeTransitionEffect = false;
         boolean removeTransitionTrigger = false;

         if (elementId.startsWith(StateMachineIdUtil.LABEL_GUARD_SUFFIX)) {
            removeTransitionGuard = true;
            elementId = StateMachineIdUtil.getElementIdFromLabelGuard(elementId);
         } else if (elementId.startsWith(StateMachineIdUtil.LABEL_EFFECT_SUFFIX)) {
            removeTransitionEffect = true;
            elementId = StateMachineIdUtil.getElementIdFromLabelEffect(elementId);
         } else if (elementId.startsWith(StateMachineIdUtil.LABEL_TRIGGER_SUFFIX)) {
            removeTransitionTrigger = true;
            elementId = StateMachineIdUtil.getElementIdFromLabelTrigger(elementId);
         }

         EObject semanticElement = getOrThrow(modelState.getIndex().getEObject(elementId),
            EObject.class, "Could not find element for id '" + elementId + "', no delete operation executed.");

         // STATE MACHINE DIAGRAM
         if (diagramType == Representation.STATEMACHINE) {
            if (semanticElement instanceof FinalState) {
               modelAccess.removeFinalState(modelState, (FinalState) semanticElement).thenAccept(response -> {
                  if (response.body() == null || response.body().isEmpty()) {
                     throw new GLSPServerException(
                        "Could not execute delete operation on Pseudo State Node: " + semanticElement.toString());
                  }
               });
            } else if (semanticElement instanceof StateMachine) {
               modelAccess.removeStateMachine(modelState, (StateMachine) semanticElement).thenAccept(response -> {
                  if (response.body() == null || response.body().isEmpty()) {
                     throw new GLSPServerException(
                        "Could not execute delete operation on State Machine Node: " + semanticElement.toString());
                  }
               });
            } else if (semanticElement instanceof State) {
               modelAccess.removeState(modelState, (State) semanticElement).thenAccept(response -> {
                  if (response.body() == null || response.body().isEmpty()) {
                     throw new GLSPServerException(
                        "Could not execute delete operation on State Node: " + semanticElement.toString());
                  }
               });
            } else if (semanticElement instanceof Pseudostate) {
               modelAccess.removePseudostate(modelState, (Pseudostate) semanticElement).thenAccept(response -> {
                  if (response.body() == null || response.body().isEmpty()) {
                     throw new GLSPServerException(
                        "Could not execute delete operation on Pseudo State Node: " + semanticElement.toString());
                  }
               });
            } else if (semanticElement instanceof Behavior) {
               modelAccess.removeBehaviorFromState(modelState, (Behavior) semanticElement).thenAccept(response -> {
                  if (response.body() == null || response.body().isEmpty()) {
                     throw new GLSPServerException(
                        "Could not execute delete operation on Behavior: " + semanticElement.toString());
                  }
               });
            } else if (semanticElement instanceof Transition) {
               if (removeTransitionGuard) {
                  modelAccess.addTransitionGuard(modelState, (Transition) semanticElement, "")
                     .thenAccept(response -> {
                        if (response.body() == null || response.body().isEmpty()) {
                           throw new GLSPServerException(
                              "Could not execute remove transition guard operation on Transition: "
                                 + semanticElement.toString());
                        }
                     });
               } else if (removeTransitionEffect) {
                  modelAccess.addTransitionEffect(modelState, (Transition) semanticElement, "")
                     .thenAccept(response -> {
                        if (response.body() == null || response.body().isEmpty()) {
                           throw new GLSPServerException(
                              "Could not execute remove transition effect operation on Transition: "
                                 + semanticElement.toString());
                        }
                     });
               } else if (removeTransitionTrigger) {
                  modelAccess.addTransitionTrigger(modelState, (Transition) semanticElement, "")
                     .thenAccept(response -> {
                        if (response.body() == null || response.body().isEmpty()) {
                           throw new GLSPServerException(
                              "Could not execute remove transition trigger operation on Transition: "
                                 + semanticElement.toString());
                        }
                     });
               } else {
                  modelAccess.removeTransition(modelState, (Transition) semanticElement).thenAccept(response -> {
                     if (response.body() == null || response.body().isEmpty()) {
                        throw new GLSPServerException(
                           "Could not execute delete operation on Transition: " + semanticElement.toString());
                     }
                  });
               }
            }
         }
      });
   }
   */
}
