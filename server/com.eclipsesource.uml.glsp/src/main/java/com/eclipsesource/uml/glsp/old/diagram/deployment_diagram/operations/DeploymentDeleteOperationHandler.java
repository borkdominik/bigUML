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
package com.eclipsesource.uml.glsp.old.diagram.deployment_diagram.operations;

public class DeploymentDeleteOperationHandler { /*-

   protected UmlModelState getUmlModelState() { return (UmlModelState) getEMSModelState(); }

   @Override
   public void executeOperation(final DeleteOperation operation, final DeploymentModelServerAccess modelAccess) {
      UmlModelState modelState = getUmlModelState();

      Representation diagramType = UmlModelState.getModelState(modelState).getNotationModel().getDiagramType();

      operation.getElementIds().forEach(elementId -> {
         EObject semanticElement = getOrThrow(modelState.getIndex().getEObject(elementId),
            EObject.class, "Could not find element for id '" + elementId + "', no delete operation executed.");

         // DEPLOYMENT DIAGRAM
         if (diagramType == Representation.DEPLOYMENT) {
            if (semanticElement instanceof DeploymentSpecification) {
               modelAccess.removeDeploymentSpecification(modelState, (DeploymentSpecification) semanticElement)
                  .thenAccept(
                     response -> {
                        if (response.body() == null || response.body().isEmpty()) {
                           throw new GLSPServerException(
                              "Could not execute delete operation on Deployment Specification: "
                                 + semanticElement.toString());
                        }
                     });
            } else if (semanticElement instanceof Artifact) {
               modelAccess.removeArtifact(modelState, (Artifact) semanticElement).thenAccept(response -> {
                  if (response.body() == null || response.body().isEmpty()) {
                     throw new GLSPServerException(
                        "Could not execute delete operation on Artifact Node: " + semanticElement.toString());
                  }
               });
            } else if (semanticElement instanceof ExecutionEnvironment) {
               modelAccess.removeExecutionEnvironment(modelState, (ExecutionEnvironment) semanticElement)
                  .thenAccept(response -> {
                     if (response.body() == null || response.body().isEmpty()) {
                        throw new GLSPServerException(
                           "Could not execute delete operation on Property: " + semanticElement.toString());
                     }
                  });
            } else if (semanticElement instanceof Device) {
               modelAccess.removeDevice(modelState, (Device) semanticElement).thenAccept(response -> {
                  if (response.body() == null || response.body().isEmpty()) {
                     throw new GLSPServerException(
                        "Could not execute delete operation on Deployment Node: " + semanticElement.toString());
                  }
               });
            } else if (semanticElement instanceof Node) {
               modelAccess.removeNode(modelState, (Node) semanticElement).thenAccept(response -> {
                  if (response.body() == null || response.body().isEmpty()) {
                     throw new GLSPServerException(
                        "Could not execute delete operation on Deployment Node: " + semanticElement.toString());
                  }
               });
            } else if (semanticElement instanceof CommunicationPath) {
               modelAccess.removeCommunicationPath(modelState, (CommunicationPath) semanticElement)
                  .thenAccept(response -> {
                     if (response.body() == null || response.body().isEmpty()) {
                        throw new GLSPServerException(
                           "Could not execute delete operation on Communication Path: " + semanticElement.toString());
                     }
                  });
            } else if (semanticElement instanceof Deployment) {
               NamedElement source = ((Deployment) semanticElement).getClients().get(0);
               modelAccess.removeDeployment(modelState, (Deployment) semanticElement, source).thenAccept(response -> {
                  if (response.body() == null || response.body().isEmpty()) {
                     throw new GLSPServerException(
                        "Could not execute delete operation on Communication Path: " + semanticElement.toString());
                  }
               });
            }
         }
      });
   }
   */
}
