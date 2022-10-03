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

public class ActivityDeleteOperationHandler {

   /*-
   protected UmlModelState getUmlModelState() { return (UmlModelState) getEMSModelState(); }
   
   public void executeOperation(final DeleteOperation operation, final ActivityModelServerAccess modelAccess) {
      UmlModelState modelState = getUmlModelState();
   
      Representation diagramType = UmlModelState.getModelState(modelState).getNotationModel().getDiagramType();
   
      operation.getElementIds().forEach(elementId -> {
   
         boolean removeGuard = false;
         boolean removeWeight = false;
   
         if (elementId.startsWith("_weight")) {
            removeWeight = true;
            elementId = elementId.replace("_weight", "");
         } else if (elementId.startsWith("_guard")) {
            removeGuard = true;
            elementId = elementId.replace("_guard", "");
         }
   
         EObject semanticElement = getOrThrow(modelState.getIndex().getEObject(elementId),
            EObject.class, "Could not find element for id '" + elementId + "', no delete operation executed.");
   
         // ACTIVITY
         if (diagramType == Representation.ACTIVITY) {
            if (semanticElement instanceof ActivityNode) {
               modelAccess.removeActivityNode(modelState, (ActivityNode) semanticElement).thenAccept(response -> {
                  if (response.body() == null || response.body().isEmpty()) {
                     throw new GLSPServerException(
                        "Could not execute delete operation on ActivityNode: " + semanticElement.toString());
                  }
               });
            } else if (semanticElement instanceof ActivityEdge) {
               if (removeGuard) {
                  modelAccess.setGuard(modelState, (ControlFlow) semanticElement, "").thenAccept(response -> {
                     if (response.body() == null || response.body().isEmpty()) {
                        throw new GLSPServerException(
                           "Could not execute remove Guard operation on ActivityEdge: " + semanticElement.toString());
                     }
                  });
               } else if (removeWeight) {
                  modelAccess.setWeight(modelState, (ControlFlow) semanticElement, "").thenAccept(response -> {
                     if (response.body() == null || response.body().isEmpty()) {
                        throw new GLSPServerException(
                           "Could not execute remove Weight operation on ActivityEdge: " + semanticElement.toString());
                     }
                  });
               } else {
                  modelAccess.removeActivityEdge(modelState, (ActivityEdge) semanticElement).thenAccept(response -> {
                     if (response.body() == null || response.body().isEmpty()) {
                        throw new GLSPServerException(
                           "Could not execute delete operation on ActivityEdge: " + semanticElement.toString());
                     }
                  });
               }
            } else if (semanticElement instanceof Activity) {
               modelAccess.removeActivity(modelState, (Activity) semanticElement).thenAccept(response -> {
                  if (response.body() == null || response.body().isEmpty()) {
                     throw new GLSPServerException(
                        "Could not execute delete operation on Activity: " + semanticElement.toString());
                  }
               });
            } else if (semanticElement instanceof ActivityGroup) {
               modelAccess.removeActivityGroup(modelState, (ActivityGroup) semanticElement).thenAccept(response -> {
                  if (response.body() == null || response.body().isEmpty()) {
                     throw new GLSPServerException(
                        "Could not execute delete operation on Activity: " + semanticElement.toString());
                  }
               });
            } else if (semanticElement instanceof ExceptionHandler) {
               modelAccess.removeExceptionHandler(modelState, (ExceptionHandler) semanticElement)
                  .thenAccept(response -> {
                     if (response.body() == null || response.body().isEmpty()) {
                        throw new GLSPServerException(
                           "Could not execute delete operation on Activity: " + semanticElement.toString());
                     }
                  });
            }
         }
      });
   }
   */

}
