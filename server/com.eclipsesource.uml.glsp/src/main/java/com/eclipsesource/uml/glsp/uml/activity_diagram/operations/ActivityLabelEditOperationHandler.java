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
package com.eclipsesource.uml.glsp.uml.activity_diagram.operations;

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.EMSBasicOperationHandler;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.server.features.directediting.ApplyLabelEditOperation;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.uml2.uml.CallBehaviorAction;
import org.eclipse.uml2.uml.Comment;
import org.eclipse.uml2.uml.Constraint;
import org.eclipse.uml2.uml.ControlFlow;
import org.eclipse.uml2.uml.Element;
import org.eclipse.uml2.uml.NamedElement;

import com.eclipsesource.uml.glsp.model.UmlModelIndex;
import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.uml.activity_diagram.ActivityModelServerAccess;
import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.eclipsesource.uml.glsp.util.UmlIDUtil;

public class ActivityLabelEditOperationHandler
   extends EMSBasicOperationHandler<ApplyLabelEditOperation, ActivityModelServerAccess> {

   protected UmlModelState getUmlModelState() { return (UmlModelState) getEMSModelState(); }

   @Override
   public void executeOperation(final ApplyLabelEditOperation editLabelOperation,
      final ActivityModelServerAccess modelAccess) {
      UmlModelState modelState = getUmlModelState();
      UmlModelIndex modelIndex = modelState.getIndex();

      String inputText = editLabelOperation.getText().trim();
      String graphicalElementId = editLabelOperation.getLabelId();

      GModelElement label = getOrThrow(modelIndex.findElementByClass(graphicalElementId, GModelElement.class),
         GModelElement.class, "Element not found.");

      switch (label.getType()) {
         case Types.CALL_REF: {

            CallBehaviorAction cba = getOrThrow(
               modelIndex.getSemantic(UmlIDUtil.getElementIdFromHeaderLabel(graphicalElementId)),
               CallBehaviorAction.class, "No valid container with id " + graphicalElementId + " found");
            modelAccess.setBehavior(modelState, cba, inputText)
               .thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException("Could not change Property to: " + inputText);
                  }
               });
            break;
         }

         case Types.LABEL_NAME:
            String containerElementId = UmlIDUtil.getElementIdFromHeaderLabel(graphicalElementId);
            Element semanticElement = getOrThrow(modelIndex.getSemantic(containerElementId),
               Element.class, "No valid container with id " + graphicalElementId + " found");

            if (semanticElement instanceof Comment) {
               modelAccess.setCommentBody(modelState, (Comment) semanticElement, inputText)
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException("Could not change Property to: " + inputText);
                     }
                  });
            } else if (semanticElement instanceof Constraint) {
               modelAccess.setConditionBody(modelState, (Constraint) semanticElement, inputText)
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException("Could not change Property to: " + inputText);
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

         case Types.LABEL_GUARD:
            containerElementId = UmlIDUtil.getEdgeIdFromGuardLabel(graphicalElementId);
            ControlFlow flow = getOrThrow(modelIndex.getSemantic(containerElementId),
               ControlFlow.class, "No valid controlFlow with id " + containerElementId + " found");
            modelAccess.setGuard(modelState, flow, inputText);
            break;

         case Types.LABEL_WEIGHT:
            containerElementId = UmlIDUtil.getEdgeFromWeightLabel(graphicalElementId);
            flow = getOrThrow(modelIndex.getSemantic(containerElementId),
               ControlFlow.class, "No valid controlFlow with id " + containerElementId + " found");
            modelAccess.setWeight(modelState, flow, inputText);
            break;

      }

   }

   @Override
   public String getLabel() { return "Apply label"; }
}
