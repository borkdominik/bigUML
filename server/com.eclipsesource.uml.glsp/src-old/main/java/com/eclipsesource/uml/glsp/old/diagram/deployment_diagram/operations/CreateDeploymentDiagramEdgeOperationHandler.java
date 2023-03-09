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

public class CreateDeploymentDiagramEdgeOperationHandler { /*-

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
         Classifier sourceNode = getOrThrow(modelIndex.getEObject(operation.getSourceElementId(), Classifier.class),
            "No semantic Node found for source element with id " + operation.getSourceElementId());
         Classifier targetNode = getOrThrow(modelIndex.getEObject(operation.getTargetElementId(), Classifier.class),
            "No semantic Node found for source element with id " + operation.getTargetElementId());
         modelAccess.addCommunicationPath(modelState, sourceNode, targetNode)
            .thenAccept(response -> {
               if (response.body() == null || response.body().isEmpty()) {
                  throw new GLSPServerException("Could not execute create operation on new Association edge");
               }
            });
      } else if (elementTypeId.equals(DeploymentTypes.DEPLOYMENT)) {
         Artifact sourceArtifact = getOrThrow(modelIndex.getEObject(operation.getSourceElementId(), Artifact.class),
            "No semantic Node found for source element with id " + operation.getSourceElementId());
         Node targetNode = getOrThrow(modelIndex.getEObject(operation.getTargetElementId(), Node.class),
            "No semantic Node found for source element with id " + operation.getTargetElementId());
         modelAccess.addDeployment(modelState, sourceArtifact, targetNode)
            .thenAccept(response -> {
               if (response.body() == null || response.body().isEmpty()) {
                  throw new GLSPServerException("Could not execute create operation on new Association edge");
               }
            });
      }
   }

   @Override
   public String getLabel() { return "Create uml edge"; }
   */
}
