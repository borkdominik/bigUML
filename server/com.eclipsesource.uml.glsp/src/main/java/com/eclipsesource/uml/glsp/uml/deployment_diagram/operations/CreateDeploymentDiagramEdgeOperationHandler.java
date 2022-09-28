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

import java.util.List;

import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.EMSBasicCreateOperationHandler;
import org.eclipse.glsp.server.operations.CreateEdgeOperation;
import org.eclipse.glsp.server.operations.Operation;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.uml2.uml.Artifact;
import org.eclipse.uml2.uml.Classifier;
import org.eclipse.uml2.uml.Node;

import com.eclipsesource.uml.glsp.model.UmlModelIndex;
import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.uml.deployment_diagram.DeploymentModelServerAccess;
import com.eclipsesource.uml.glsp.uml.deployment_diagram.constants.DeploymentTypes;
import com.google.common.collect.Lists;

public class CreateDeploymentDiagramEdgeOperationHandler
   extends EMSBasicCreateOperationHandler<CreateEdgeOperation, DeploymentModelServerAccess> {

   public CreateDeploymentDiagramEdgeOperationHandler() {
      super(handledElementTypeIds);
   }

   private static List<String> handledElementTypeIds = Lists.newArrayList(
      DeploymentTypes.COMMUNICATION_PATH,
      DeploymentTypes.DEPLOYMENT);

   @Override
   public boolean handles(final Operation execAction) {
      if (execAction instanceof CreateEdgeOperation) {
         CreateEdgeOperation action = (CreateEdgeOperation) execAction;
         return handledElementTypeIds.contains(action.getElementTypeId());
      }
      return false;
   }

   protected UmlModelState getUmlModelState() { return (UmlModelState) getEMSModelState(); }

   @Override
   public void executeOperation(final CreateEdgeOperation operation, final DeploymentModelServerAccess modelAccess) {

      UmlModelState modelState = getUmlModelState();
      String elementTypeId = operation.getElementTypeId();

      UmlModelIndex modelIndex = modelState.getIndex();
      if (elementTypeId.equals(DeploymentTypes.COMMUNICATION_PATH)) {
         Classifier sourceNode = getOrThrow(modelIndex.getSemantic(operation.getSourceElementId(), Classifier.class),
            "No semantic Node found for source element with id " + operation.getSourceElementId());
         Classifier targetNode = getOrThrow(modelIndex.getSemantic(operation.getTargetElementId(), Classifier.class),
            "No semantic Node found for source element with id " + operation.getTargetElementId());
         modelAccess.addCommunicationPath(modelState, sourceNode, targetNode)
            .thenAccept(response -> {
               if (!response.body()) {
                  throw new GLSPServerException("Could not execute create operation on new Association edge");
               }
            });
      } else if (elementTypeId.equals(DeploymentTypes.DEPLOYMENT)) {
         Artifact sourceArtifact = getOrThrow(modelIndex.getSemantic(operation.getSourceElementId(), Artifact.class),
            "No semantic Node found for source element with id " + operation.getSourceElementId());
         Node targetNode = getOrThrow(modelIndex.getSemantic(operation.getTargetElementId(), Node.class),
            "No semantic Node found for source element with id " + operation.getTargetElementId());
         modelAccess.addDeployment(modelState, sourceArtifact, targetNode)
            .thenAccept(response -> {
               if (!response.body()) {
                  throw new GLSPServerException("Could not execute create operation on new Association edge");
               }
            });
      }
   }

   @Override
   public String getLabel() { return "Create uml edge"; }

}
