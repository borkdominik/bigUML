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

import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.EMSBasicOperationHandler;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.server.features.directediting.ApplyLabelEditOperation;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.uml2.uml.Behavior;
import org.eclipse.uml2.uml.Constraint;
import org.eclipse.uml2.uml.Element;
import org.eclipse.uml2.uml.NamedElement;
import org.eclipse.uml2.uml.Pseudostate;
import org.eclipse.uml2.uml.State;
import org.eclipse.uml2.uml.StateMachine;

import com.eclipsesource.uml.glsp.model.UmlModelIndex;
import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.uml.statemachine_diagram.StateMachineModelServerAccess;
import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.eclipsesource.uml.glsp.util.UmlIDUtil;

public class StateMachineLabelEditOperationHandler
   extends EMSBasicOperationHandler<ApplyLabelEditOperation, StateMachineModelServerAccess> {

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
         case Types.LABEL_NAME:
            String containerElementId = UmlIDUtil.getElementIdFromHeaderLabel(graphicalElementId);
            Element semanticElement = getOrThrow(modelIndex.getSemantic(containerElementId),
               Element.class, "No valid container with id " + graphicalElementId + " found");
            if (semanticElement instanceof Constraint) {
               modelAccess.setConditionBody(modelState, (Constraint) semanticElement, inputText)
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException("Could not change Property to: " + inputText);
                     }
                  });
            } else if (semanticElement instanceof StateMachine) {
               modelAccess.setStateMachineName(modelState, (StateMachine) semanticElement, inputText)
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException("Could not rename State Machine to: " + inputText);
                     }
                  });
            } else if (semanticElement instanceof State) {
               modelAccess.setStateName(modelState, (State) semanticElement, inputText)
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException("Could not rename State to: " + inputText);
                     }
                  });
            } else if (semanticElement instanceof Pseudostate) {
               modelAccess.setPseudostateName(modelState, (Pseudostate) semanticElement, inputText)
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException("Could not rename Pseudo State to: " + inputText);
                     }
                  });
            } else if (semanticElement instanceof NamedElement) {
               modelAccess.renameElement(modelState, (NamedElement) semanticElement, inputText)
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException("Could not change Property to: " + inputText);
                     }
                  });
            }
            break;

         case Types.STATE_ENTRY_ACTIVITY:
            containerElementId = UmlIDUtil.getElementIdFromHeaderLabel(graphicalElementId);
            Behavior behavior = getOrThrow(modelIndex.getSemantic(containerElementId),
               Behavior.class, "No valid container with id " + graphicalElementId + " found");

            modelAccess.setBehaviorInState(modelState, behavior, Types.STATE_ENTRY_ACTIVITY, inputText)
               .thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException("Could not change Behavior to: " + inputText);
                  }
               });

            break;

         case Types.STATE_DO_ACTIVITY:
            containerElementId = UmlIDUtil.getElementIdFromHeaderLabel(graphicalElementId);
            behavior = getOrThrow(modelIndex.getSemantic(containerElementId),
               Behavior.class, "No valid container with id " + graphicalElementId + " found");

            modelAccess.setBehaviorInState(modelState, behavior, Types.STATE_DO_ACTIVITY, inputText)
               .thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException("Could not change Behavior to: " + inputText);
                  }
               });

            break;

         case Types.STATE_EXIT_ACTIVITY:
            containerElementId = UmlIDUtil.getElementIdFromHeaderLabel(graphicalElementId);
            behavior = getOrThrow(modelIndex.getSemantic(containerElementId),
               Behavior.class, "No valid container with id " + graphicalElementId + " found");

            modelAccess.setBehaviorInState(modelState, behavior, Types.STATE_EXIT_ACTIVITY, inputText)
               .thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException("Could not change Behavior to: " + inputText);
                  }
               });

            break;
      }

   }

   @Override
   public String getLabel() { return "Apply label"; }
}
