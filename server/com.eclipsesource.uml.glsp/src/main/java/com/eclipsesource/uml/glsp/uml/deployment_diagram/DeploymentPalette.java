/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.deployment_diagram;

import java.util.List;
import java.util.Map;

import org.eclipse.glsp.server.actions.TriggerEdgeCreationAction;
import org.eclipse.glsp.server.actions.TriggerNodeCreationAction;
import org.eclipse.glsp.server.features.toolpalette.PaletteItem;

import com.eclipsesource.uml.glsp.uml.deployment_diagram.constants.DeploymentTypes;
import com.google.common.collect.Lists;

public class DeploymentPalette {
   public List<PaletteItem> getItems(final Map<String, String> args) {
      return Lists.newArrayList(classifiersDeployment(), relationsDeployment());
   }

   private PaletteItem classifiersDeployment() {
      PaletteItem createDeploymentNode = node(DeploymentTypes.DEPLOYMENT_NODE, "Node", "umldeploymentnode");
      PaletteItem createArtifact = node(DeploymentTypes.ARTIFACT, "Artifact", "umlartifact");
      PaletteItem createDevice = node(DeploymentTypes.DEVICE, "Device", "umldevice");
      PaletteItem createExecutionEnvironment = node(DeploymentTypes.EXECUTION_ENVIRONMENT, "Execution Environment",
         "umlexecutionenvironment");
      PaletteItem createDeploymentSpecification = node(DeploymentTypes.DEPLOYMENT_SPECIFICATION,
         "Deployment Specification",
         "umldeploymentspecification");
      PaletteItem createComponent = node(DeploymentTypes.DEPLOYMENT_COMPONENT, "Component", "umlcomponent");

      List<PaletteItem> classifiers = Lists.newArrayList(
         createDeploymentNode, createArtifact, createDevice, createExecutionEnvironment,
         createDeploymentSpecification, createComponent);
      return PaletteItem.createPaletteGroup("uml.classifier", "Container", classifiers, "symbol-property");
   }

   private PaletteItem relationsDeployment() {
      PaletteItem createCommunicationPath = edge(DeploymentTypes.COMMUNICATION_PATH, "Communication Path",
         "umlcommunicationpath");
      PaletteItem createDeployment = edge(DeploymentTypes.DEPLOYMENT, "Deployment", "umldeployment");

      List<PaletteItem> relations = Lists.newArrayList(createCommunicationPath, createDeployment);
      return PaletteItem.createPaletteGroup("uml.relation", "Relations", relations, "symbol-property");
   }

   private PaletteItem node(final String elementTypeId, final String label, final String icon) {
      return new PaletteItem(elementTypeId, label, new TriggerNodeCreationAction(elementTypeId), icon);
   }

   private PaletteItem edge(final String elementTypeId, final String label, final String icon) {
      return new PaletteItem(elementTypeId, label, new TriggerEdgeCreationAction(elementTypeId), icon);
   }

}
