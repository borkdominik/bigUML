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

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.EMSBasicOperationHandler;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.server.features.directediting.ApplyLabelEditOperation;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.uml2.uml.Artifact;
import org.eclipse.uml2.uml.CommunicationPath;
import org.eclipse.uml2.uml.Component;
import org.eclipse.uml2.uml.Constraint;
import org.eclipse.uml2.uml.DeploymentSpecification;
import org.eclipse.uml2.uml.Device;
import org.eclipse.uml2.uml.Element;
import org.eclipse.uml2.uml.ExecutionEnvironment;
import org.eclipse.uml2.uml.NamedElement;
import org.eclipse.uml2.uml.Node;

import com.eclipsesource.uml.glsp.model.UmlModelIndex;
import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.uml.deployment_diagram.DeploymentModelServerAccess;
import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.eclipsesource.uml.glsp.util.UmlIDUtil;

public class DeploymentLabelEditOperationHandler
   extends EMSBasicOperationHandler<ApplyLabelEditOperation, DeploymentModelServerAccess> {

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
            Element semanticElement = getOrThrow(modelIndex.getSemantic(containerElementId),
               Element.class, "No valid container with id " + graphicalElementId + " found");

            if (semanticElement instanceof Constraint) {
               modelAccess.setConditionBody(modelState, (Constraint) semanticElement, inputText)
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException("Could not change Property to: " + inputText);
                     }
                  });
            } else if (semanticElement instanceof DeploymentSpecification) {
               modelAccess
                  .setDeploymentSpecificationName(modelState, (DeploymentSpecification) semanticElement, inputText)
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException("Could not rename Deployment Specification to: " + inputText);
                     }
                  });
            } else if (semanticElement instanceof Artifact) {
               modelAccess.setArtifactName(modelState, (Artifact) semanticElement, inputText)
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException("Could not rename Artifact to: " + inputText);
                     }
                  });
            } else if (semanticElement instanceof Device) {
               modelAccess.setDeviceName(modelState, (Device) semanticElement, inputText)
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException("Could not rename Device to: " + inputText);
                     }
                  });
            } else if (semanticElement instanceof ExecutionEnvironment) {
               modelAccess.setExecutionEnvironmentName(modelState, (ExecutionEnvironment) semanticElement, inputText)
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException("Could not rename Execution Environment to: " + inputText);
                     }
                  });
            } else if (semanticElement instanceof CommunicationPath) {
               modelAccess.setCommunicationPathEndName(modelState, (CommunicationPath) semanticElement, inputText)
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException("Could not rename Communication Path to: " + inputText);
                     }
                  });
            } else if (semanticElement instanceof Node) {
               modelAccess.setNodeName(modelState, (Node) semanticElement, inputText)
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException("Could not rename UseCase to: " + inputText);
                     }
                  });
            } else if (semanticElement instanceof Component) {
               modelAccess.setDeploymentComponentName(modelState, (Component) semanticElement, inputText)
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException("Could not rename Object to: " + inputText);
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
      }

   }

   @Override
   public String getLabel() { return "Apply label"; }

}
