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
package com.eclipsesource.uml.glsp.old.diagram.statemachine_diagram.operations;

public class StateMachineLabelEditOperationHandler { /*-

   protected UmlModelState getUmlModelState() { return (UmlModelState) getEMSModelState(); }

   @Override
   public void executeOperation(final ApplyLabelEditOperation editLabelOperation,
      final StateMachineModelServerAccess modelAccess) {
      UmlModelState modelState = getUmlModelState();
      UmlModelIndex modelIndex = modelState.getIndex();

      String inputText = editLabelOperation.getText().trim();
      String graphicalElementId = editLabelOperation.getLabelId();

      GModelElement label = getOrThrow(modelIndex.findElementByClass(graphicalElementId, GModelElement.class),
         GModelElement.class, "Element not found.");

      switch (label.getType()) {
         case UmlConfig.Types.LABEL_NAME:
            String containerElementId = UmlIDUtil.getElementIdFromHeaderLabel(graphicalElementId);
            Element semanticElement = getOrThrow(modelIndex.getEObject(containerElementId),
               Element.class, "No valid container with id " + graphicalElementId + " found");
            if (semanticElement instanceof Constraint) {
               modelAccess.setConditionBody(modelState, (Constraint) semanticElement, inputText)
                  .thenAccept(response -> {
                     if (response.body() == null || response.body().isEmpty()) {
                        throw new GLSPServerException("Could not change Property to: " + inputText);
                     }
                  });
            } else if (semanticElement instanceof StateMachine) {
               modelAccess.setStateMachineName(modelState, (StateMachine) semanticElement, inputText)
                  .thenAccept(response -> {
                     if (response.body() == null || response.body().isEmpty()) {
                        throw new GLSPServerException("Could not rename State Machine to: " + inputText);
                     }
                  });
            } else if (semanticElement instanceof State) {
               modelAccess.setStateName(modelState, (State) semanticElement, inputText)
                  .thenAccept(response -> {
                     if (response.body() == null || response.body().isEmpty()) {
                        throw new GLSPServerException("Could not rename State to: " + inputText);
                     }
                  });
            } else if (semanticElement instanceof Pseudostate) {
               modelAccess.setPseudostateName(modelState, (Pseudostate) semanticElement, inputText)
                  .thenAccept(response -> {
                     if (response.body() == null || response.body().isEmpty()) {
                        throw new GLSPServerException("Could not rename Pseudo State to: " + inputText);
                     }
                  });
            } else if (semanticElement instanceof NamedElement) {
               modelAccess.renameElement(modelState, (NamedElement) semanticElement, inputText)
                  .thenAccept(response -> {
                     if (response.body() == null || response.body().isEmpty()) {
                        throw new GLSPServerException("Could not change Property to: " + inputText);
                     }
                  });
            }
            break;

         case StateMachineTypes.STATE_ENTRY_ACTIVITY:
            containerElementId = UmlIDUtil.getElementIdFromHeaderLabel(graphicalElementId);
            Behavior behavior = getOrThrow(modelIndex.getEObject(containerElementId),
               Behavior.class, "No valid container with id " + graphicalElementId + " found");

            modelAccess.setBehaviorInState(modelState, behavior, StateMachineTypes.STATE_ENTRY_ACTIVITY, inputText)
               .thenAccept(response -> {
                  if (response.body() == null || response.body().isEmpty()) {
                     throw new GLSPServerException("Could not change Behavior to: " + inputText);
                  }
               });

            break;

         case StateMachineTypes.STATE_DO_ACTIVITY:
            containerElementId = UmlIDUtil.getElementIdFromHeaderLabel(graphicalElementId);
            behavior = getOrThrow(modelIndex.getEObject(containerElementId),
               Behavior.class, "No valid container with id " + graphicalElementId + " found");

            modelAccess.setBehaviorInState(modelState, behavior, StateMachineTypes.STATE_DO_ACTIVITY, inputText)
               .thenAccept(response -> {
                  if (response.body() == null || response.body().isEmpty()) {
                     throw new GLSPServerException("Could not change Behavior to: " + inputText);
                  }
               });

            break;

         case StateMachineTypes.STATE_EXIT_ACTIVITY:
            containerElementId = UmlIDUtil.getElementIdFromHeaderLabel(graphicalElementId);
            behavior = getOrThrow(modelIndex.getEObject(containerElementId),
               Behavior.class, "No valid container with id " + graphicalElementId + " found");

            modelAccess.setBehaviorInState(modelState, behavior, StateMachineTypes.STATE_EXIT_ACTIVITY, inputText)
               .thenAccept(response -> {
                  if (response.body() == null || response.body().isEmpty()) {
                     throw new GLSPServerException("Could not change Behavior to: " + inputText);
                  }
               });

            break;
      }

   }

   @Override
   public String getLabel() { return "Apply label"; }
   */
}
