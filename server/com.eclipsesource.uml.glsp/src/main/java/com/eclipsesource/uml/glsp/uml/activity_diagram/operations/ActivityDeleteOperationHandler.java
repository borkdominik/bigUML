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

import org.eclipse.emf.ecore.EObject;
import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.EMSBasicOperationHandler;
import org.eclipse.glsp.server.operations.DeleteOperation;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.uml2.uml.Activity;
import org.eclipse.uml2.uml.ActivityEdge;
import org.eclipse.uml2.uml.ActivityGroup;
import org.eclipse.uml2.uml.ActivityNode;
import org.eclipse.uml2.uml.ControlFlow;
import org.eclipse.uml2.uml.ExceptionHandler;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.uml.activity_diagram.ActivityModelServerAccess;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public class ActivityDeleteOperationHandler
   extends EMSBasicOperationHandler<DeleteOperation, ActivityModelServerAccess> {

   protected UmlModelState getUmlModelState() { return (UmlModelState) getEMSModelState(); }

   @Override
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

         EObject semanticElement = getOrThrow(modelState.getIndex().getSemantic(elementId),
            EObject.class, "Could not find element for id '" + elementId + "', no delete operation executed.");

         // ACTIVITY
         if (diagramType == Representation.ACTIVITY) {
            if (semanticElement instanceof ActivityNode) {
               modelAccess.removeActivityNode(modelState, (ActivityNode) semanticElement).thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException(
                        "Could not execute delete operation on ActivityNode: " + semanticElement.toString());
                  }
               });
            } else if (semanticElement instanceof ActivityEdge) {
               if (removeGuard) {
                  modelAccess.setGuard(modelState, (ControlFlow) semanticElement, "").thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException(
                           "Could not execute remove Guard operation on ActivityEdge: " + semanticElement.toString());
                     }
                  });
               } else if (removeWeight) {
                  modelAccess.setWeight(modelState, (ControlFlow) semanticElement, "").thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException(
                           "Could not execute remove Weight operation on ActivityEdge: " + semanticElement.toString());
                     }
                  });
               } else {
                  modelAccess.removeActivityEdge(modelState, (ActivityEdge) semanticElement).thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException(
                           "Could not execute delete operation on ActivityEdge: " + semanticElement.toString());
                     }
                  });
               }
            } else if (semanticElement instanceof Activity) {
               modelAccess.removeActivity(modelState, (Activity) semanticElement).thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException(
                        "Could not execute delete operation on Activity: " + semanticElement.toString());
                  }
               });
            } else if (semanticElement instanceof ActivityGroup) {
               modelAccess.removeActivityGroup(modelState, (ActivityGroup) semanticElement).thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException(
                        "Could not execute delete operation on Activity: " + semanticElement.toString());
                  }
               });
            } else if (semanticElement instanceof ExceptionHandler) {
               modelAccess.removeExceptionHandler(modelState, (ExceptionHandler) semanticElement)
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException(
                           "Could not execute delete operation on Activity: " + semanticElement.toString());
                     }
                  });
            }
         }
      });
   }

}
