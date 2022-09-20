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

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.EMSBasicOperationHandler;
import org.eclipse.glsp.server.operations.DeleteOperation;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.uml2.uml.Behavior;
import org.eclipse.uml2.uml.FinalState;
import org.eclipse.uml2.uml.Pseudostate;
import org.eclipse.uml2.uml.State;
import org.eclipse.uml2.uml.StateMachine;
import org.eclipse.uml2.uml.Transition;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.uml.statemachine_diagram.StateMachineModelServerAccess;
import com.eclipsesource.uml.glsp.util.UmlIDUtil;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public class StateMachineDeleteOperationHandler
   extends EMSBasicOperationHandler<DeleteOperation, StateMachineModelServerAccess> {

   protected UmlModelState getUmlModelState() { return (UmlModelState) getEMSModelState(); }

   @Override
   public void executeOperation(final DeleteOperation operation, final StateMachineModelServerAccess modelAccess) {
      UmlModelState modelState = getUmlModelState();

      Representation diagramType = UmlModelState.getModelState(modelState).getNotationModel().getDiagramType();

      operation.getElementIds().forEach(elementId -> {

         boolean removeTransitionGuard = false;
         boolean removeTransitionEffect = false;
         boolean removeTransitionTrigger = false;

         if (elementId.endsWith(UmlIDUtil.PROPERTY_SUFFIX)) {
            elementId = UmlIDUtil.getElementIdFromProperty(elementId);
         } else if (elementId.startsWith(UmlIDUtil.LABEL_GUARD_SUFFIX)) {
            removeTransitionGuard = true;
            elementId = UmlIDUtil.getElementIdFromLabelGuard(elementId);
         } else if (elementId.startsWith(UmlIDUtil.LABEL_EFFECT_SUFFIX)) {
            removeTransitionEffect = true;
            elementId = UmlIDUtil.getElementIdFromLabelEffect(elementId);
         } else if (elementId.startsWith(UmlIDUtil.LABEL_TRIGGER_SUFFIX)) {
            removeTransitionTrigger = true;
            elementId = UmlIDUtil.getElementIdFromLabelTrigger(elementId);
         }

         EObject semanticElement = getOrThrow(modelState.getIndex().getSemantic(elementId),
            EObject.class, "Could not find element for id '" + elementId + "', no delete operation executed.");

         // STATE MACHINE DIAGRAM
         if (diagramType == Representation.STATEMACHINE) {
            if (semanticElement instanceof FinalState) {
               modelAccess.removeFinalState(modelState, (FinalState) semanticElement).thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException(
                        "Could not execute delete operation on Pseudo State Node: " + semanticElement.toString());
                  }
               });
            } else if (semanticElement instanceof StateMachine) {
               modelAccess.removeStateMachine(modelState, (StateMachine) semanticElement).thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException(
                        "Could not execute delete operation on State Machine Node: " + semanticElement.toString());
                  }
               });
            } else if (semanticElement instanceof State) {
               modelAccess.removeState(modelState, (State) semanticElement).thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException(
                        "Could not execute delete operation on State Node: " + semanticElement.toString());
                  }
               });
            } else if (semanticElement instanceof Pseudostate) {
               modelAccess.removePseudostate(modelState, (Pseudostate) semanticElement).thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException(
                        "Could not execute delete operation on Pseudo State Node: " + semanticElement.toString());
                  }
               });
            } else if (semanticElement instanceof Behavior) {
               modelAccess.removeBehaviorFromState(modelState, (Behavior) semanticElement).thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException(
                        "Could not execute delete operation on Behavior: " + semanticElement.toString());
                  }
               });
            } else if (semanticElement instanceof Transition) {
               if (removeTransitionGuard) {
                  modelAccess.addTransitionGuard(modelState, (Transition) semanticElement, "")
                     .thenAccept(response -> {
                        if (!response.body()) {
                           throw new GLSPServerException(
                              "Could not execute remove transition guard operation on Transition: "
                                 + semanticElement.toString());
                        }
                     });
               } else if (removeTransitionEffect) {
                  modelAccess.addTransitionEffect(modelState, (Transition) semanticElement, "")
                     .thenAccept(response -> {
                        if (!response.body()) {
                           throw new GLSPServerException(
                              "Could not execute remove transition effect operation on Transition: "
                                 + semanticElement.toString());
                        }
                     });
               } else if (removeTransitionTrigger) {
                  modelAccess.addTransitionTrigger(modelState, (Transition) semanticElement, "")
                     .thenAccept(response -> {
                        if (!response.body()) {
                           throw new GLSPServerException(
                              "Could not execute remove transition trigger operation on Transition: "
                                 + semanticElement.toString());
                        }
                     });
               } else {
                  modelAccess.removeTransition(modelState, (Transition) semanticElement).thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException(
                           "Could not execute delete operation on Transition: " + semanticElement.toString());
                     }
                  });
               }
            }
         }
      });
   }

}
