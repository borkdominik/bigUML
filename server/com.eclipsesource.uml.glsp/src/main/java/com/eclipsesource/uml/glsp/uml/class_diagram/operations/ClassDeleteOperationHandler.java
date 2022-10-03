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
package com.eclipsesource.uml.glsp.uml.class_diagram.operations;

public class ClassDeleteOperationHandler {
   /*-

   protected UmlModelState getUmlModelState() { return (UmlModelState) getEMSModelState(); }
   
   @Override
   public void executeOperation(final DeleteOperation operation, final ClassModelServerAccess modelAccess) {
      UmlModelState modelState = getUmlModelState();
   
      Representation diagramType = UmlModelState.getModelState(modelState).getNotationModel().getDiagramType();
   
      operation.getElementIds().forEach(elementId -> {
         EObject semanticElement = getOrThrow(modelState.getIndex().getEObject(elementId),
            EObject.class, "Could not find element for id '" + elementId + "', no delete operation executed.");
   
         if (diagramType == Representation.CLASS || diagramType == Representation.OBJECT) {
            if (semanticElement instanceof Class) {
               modelAccess.removeClass(modelState, (Class) semanticElement).thenAccept(response -> {
                  if (response.body() == null || response.body().isEmpty()) {
                     throw new GLSPServerException(
                        "Could not execute delete operation on Class: " + semanticElement.toString());
                  }
               });
            } else if (semanticElement instanceof Interface) {
               modelAccess.removeInterface(modelState, (Interface) semanticElement).thenAccept(response -> {
                  if (response.body() == null || response.body().isEmpty()) {
                     throw new GLSPServerException(
                        "Could not execute delete operation on Interface: " + semanticElement.toString());
                  }
               });
            } else if (semanticElement instanceof Enumeration) {
               modelAccess.removeEnumeration(modelState, (Enumeration) semanticElement).thenAccept(response -> {
                  if (response.body() == null || response.body().isEmpty()) {
                     throw new GLSPServerException(
                        "Could not execute delete operation on Enumeration: " + semanticElement.toString());
                  }
               });
            } else if (semanticElement instanceof Property) {
               modelAccess.removeProperty(modelState, (Property) semanticElement).thenAccept(response -> {
                  if (response.body() == null || response.body().isEmpty()) {
                     throw new GLSPServerException(
                        "Could not execute delete operation on Property: " + semanticElement.toString());
                  }
               });
            } else if (semanticElement instanceof Association) {
               modelAccess.removeAssociation(modelState, (Association) semanticElement).thenAccept(response -> {
                  if (response.body() == null || response.body().isEmpty()) {
                     throw new GLSPServerException(
                        "Could not execute delete operation on Association: " + semanticElement.toString());
                  }
               });
            }
         }
      });
   }
   */
}
