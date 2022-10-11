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
package com.eclipsesource.uml.glsp.old.diagram.usecase_diagram.operations;

public class UseCaseDeleteOperationHandler { /*-

   protected UmlModelState getUmlModelState() { return (UmlModelState) getEMSModelState(); }

   @Override
   public void executeOperation(final DeleteOperation operation, final UseCaseModelServerAccess modelAccess) {
      UmlModelState modelState = getUmlModelState();

      Representation diagramType = UmlModelState.getModelState(modelState).getNotationModel().getDiagramType();

      operation.getElementIds().forEach(elementId -> {
         EObject semanticElement = getOrThrow(modelState.getIndex().getEObject(elementId),
            EObject.class, "Could not find element for id '" + elementId + "', no delete operation executed.");

         if (diagramType == Representation.USECASE) {

            if (semanticElement instanceof Actor) {
               modelAccess.removeActor(modelState, (Actor) semanticElement).thenAccept(response -> {
                  if (response.body() == null || response.body().isEmpty()) {
                     throw new GLSPServerException(
                        "Could not execute delete operation on UseCase: " + semanticElement.toString());
                  }
               });
            } else if (semanticElement instanceof UseCase) {
               modelAccess.removeUseCase(modelState, (UseCase) semanticElement).thenAccept(response -> {
                  if (response.body() == null || response.body().isEmpty()) {
                     throw new GLSPServerException(
                        "Could not execute delete operation on UseCase: " + semanticElement.toString());
                  }
               });
            } else if (semanticElement instanceof Component) {
               modelAccess.removeComponent(modelState, (Component) semanticElement).thenAccept(response -> {
                  if (response.body() == null || response.body().isEmpty()) {
                     throw new GLSPServerException(
                        "Could not execute delete operation on UseCase: " + semanticElement.toString());
                  }
               });
            } else if (semanticElement instanceof ExtensionPoint) {
               modelAccess.removeExtensionPoint(modelState, (ExtensionPoint) semanticElement).thenAccept(response -> {
                  if (response.body() == null || response.body().isEmpty()) {
                     throw new GLSPServerException(
                        "Could not execute delete operation on ExtensionPoint: " + semanticElement.toString());
                  }
               });
            } else if (semanticElement instanceof Package) {
               modelAccess.removePackage(modelState, (Package) semanticElement).thenAccept(response -> {
                  if (response.body() == null || response.body().isEmpty()) {
                     throw new GLSPServerException(
                        "Could not execute delete operation on Package: " + semanticElement.toString());
                  }
               });
            } else if (semanticElement instanceof Extend) {
               modelAccess.removeExtend(modelState, (Extend) semanticElement).thenAccept(response -> {
                  if (response.body() == null || response.body().isEmpty()) {
                     throw new GLSPServerException(
                        "Could not execute delete operation on Extend: " + semanticElement.toString());
                  }
               });
            } else if (semanticElement instanceof Include) {
               modelAccess.removeInclude(modelState, (Include) semanticElement).thenAccept(response -> {
                  if (response.body() == null || response.body().isEmpty()) {
                     throw new GLSPServerException(
                        "Could not execute delete operation on Include: " + semanticElement.toString());
                  }
               });
            } else if (semanticElement instanceof Generalization) {
               modelAccess.removeGeneralization(modelState, (Generalization) semanticElement).thenAccept(response -> {
                  if (response.body() == null || response.body().isEmpty()) {
                     throw new GLSPServerException(
                        "Could not execute delete operation on Generalization: " + semanticElement.toString());
                  }
               });
            }
         }
      });
   }
   */
}
