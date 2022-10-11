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
package com.eclipsesource.uml.glsp.old.diagram.activity_diagram.operations;

public class ActivityLabelEditOperationHandler {
   /*-
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
         case ActivityTypes.CALL_REF: {
   
            CallBehaviorAction cba = getOrThrow(
               modelIndex.getEObject(UmlIDUtil.getElementIdFromHeaderLabel(graphicalElementId)),
               CallBehaviorAction.class, "No valid container with id " + graphicalElementId + " found");
            modelAccess.setBehavior(modelState, cba, inputText)
               .thenAccept(response -> {
                  if (response.body() == null || response.body().isEmpty()) {
                     throw new GLSPServerException("Could not change Property to: " + inputText);
                  }
               });
            break;
         }
   
         case Types.LABEL_NAME:
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
            } else if (semanticElement instanceof NamedElement) {
               modelAccess.renameElement(modelState, (NamedElement) semanticElement, inputText)
                  .thenAccept(response -> {
                     if (response.body() == null || response.body().isEmpty()) {
                        throw new GLSPServerException("Could not change Property to: " + inputText);
                     }
                  });
            }
            break;
   
         case ActivityTypes.LABEL_GUARD:
            containerElementId = ActivityIdUtil.getEdgeIdFromGuardLabel(graphicalElementId);
            ControlFlow flow = getOrThrow(modelIndex.getEObject(containerElementId),
               ControlFlow.class, "No valid controlFlow with id " + containerElementId + " found");
            modelAccess.setGuard(modelState, flow, inputText);
            break;
   
         case ActivityTypes.LABEL_WEIGHT:
            containerElementId = ActivityIdUtil.getEdgeFromWeightLabel(graphicalElementId);
            flow = getOrThrow(modelIndex.getEObject(containerElementId),
               ControlFlow.class, "No valid controlFlow with id " + containerElementId + " found");
            modelAccess.setWeight(modelState, flow, inputText);
            break;
   
      }
   
   }
   
   @Override
   public String getLabel() { return "Apply label"; }
   */
}
