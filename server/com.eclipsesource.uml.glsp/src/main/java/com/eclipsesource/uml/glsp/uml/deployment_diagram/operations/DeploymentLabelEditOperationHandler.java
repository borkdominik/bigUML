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
package com.eclipsesource.uml.glsp.uml.deployment_diagram.operations;

public class DeploymentLabelEditOperationHandler { /*-

   protected UmlModelState getUmlModelState() { return (UmlModelState) getEMSModelState(); }

   @Override
   public void executeOperation(final ApplyLabelEditOperation editLabelOperation,
      final DeploymentModelServerAccess modelAccess) {
      UmlModelState modelState = getUmlModelState();
      UmlModelIndex modelIndex = modelState.getIndex();

      String inputText = editLabelOperation.getText().trim();
      String graphicalElementId = editLabelOperation.getLabelId();

      GModelElement label = getOrThrow(modelIndex.findElementByClass(graphicalElementId, GModelElement.class),
         GModelElement.class, "Element not found.");

      switch (label.getType()) {
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
            } else if (semanticElement instanceof DeploymentSpecification) {
               modelAccess
                  .setDeploymentSpecificationName(modelState, (DeploymentSpecification) semanticElement, inputText)
                  .thenAccept(response -> {
                     if (response.body() == null || response.body().isEmpty()) {
                        throw new GLSPServerException("Could not rename Deployment Specification to: " + inputText);
                     }
                  });
            } else if (semanticElement instanceof Artifact) {
               modelAccess.setArtifactName(modelState, (Artifact) semanticElement, inputText)
                  .thenAccept(response -> {
                     if (response.body() == null || response.body().isEmpty()) {
                        throw new GLSPServerException("Could not rename Artifact to: " + inputText);
                     }
                  });
            } else if (semanticElement instanceof Device) {
               modelAccess.setDeviceName(modelState, (Device) semanticElement, inputText)
                  .thenAccept(response -> {
                     if (response.body() == null || response.body().isEmpty()) {
                        throw new GLSPServerException("Could not rename Device to: " + inputText);
                     }
                  });
            } else if (semanticElement instanceof ExecutionEnvironment) {
               modelAccess.setExecutionEnvironmentName(modelState, (ExecutionEnvironment) semanticElement, inputText)
                  .thenAccept(response -> {
                     if (response.body() == null || response.body().isEmpty()) {
                        throw new GLSPServerException("Could not rename Execution Environment to: " + inputText);
                     }
                  });
            } else if (semanticElement instanceof CommunicationPath) {
               modelAccess.setCommunicationPathEndName(modelState, (CommunicationPath) semanticElement, inputText)
                  .thenAccept(response -> {
                     if (response.body() == null || response.body().isEmpty()) {
                        throw new GLSPServerException("Could not rename Communication Path to: " + inputText);
                     }
                  });
            } else if (semanticElement instanceof Node) {
               modelAccess.setNodeName(modelState, (Node) semanticElement, inputText)
                  .thenAccept(response -> {
                     if (response.body() == null || response.body().isEmpty()) {
                        throw new GLSPServerException("Could not rename UseCase to: " + inputText);
                     }
                  });
            } else if (semanticElement instanceof Component) {
               modelAccess.setDeploymentComponentName(modelState, (Component) semanticElement, inputText)
                  .thenAccept(response -> {
                     if (response.body() == null || response.body().isEmpty()) {
                        throw new GLSPServerException("Could not rename Object to: " + inputText);
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
      }

   }

   @Override
   public String getLabel() { return "Apply label"; }
   */
}
