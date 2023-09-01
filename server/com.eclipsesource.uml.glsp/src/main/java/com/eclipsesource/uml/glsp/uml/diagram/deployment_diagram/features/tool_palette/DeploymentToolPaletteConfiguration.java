/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.features.tool_palette;

import java.util.List;
import java.util.Map;

import org.eclipse.glsp.server.features.toolpalette.PaletteItem;

import com.eclipsesource.uml.glsp.core.features.tool_palette.PaletteItemUtil;
import com.eclipsesource.uml.glsp.core.features.tool_palette.ToolPaletteConfiguration;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.diagram.UmlDeployment_Artifact;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.diagram.UmlDeployment_CommunicationPath;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.diagram.UmlDeployment_Dependency;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.diagram.UmlDeployment_Deployment;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.diagram.UmlDeployment_DeploymentSpecification;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.diagram.UmlDeployment_Device;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.diagram.UmlDeployment_ExecutionEnvironment;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.diagram.UmlDeployment_Generalization;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.diagram.UmlDeployment_Manifestation;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.diagram.UmlDeployment_Model;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.diagram.UmlDeployment_Node;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.diagram.UmlDeployment_Operation;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.diagram.UmlDeployment_Package;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.diagram.UmlDeployment_Property;

public final class DeploymentToolPaletteConfiguration implements ToolPaletteConfiguration {
   @Override
   public List<PaletteItem> getItems(final Map<String, String> args) {
      return List.of(containers(),
         features(),
         relations()

      );
   }

   private PaletteItem containers() {
      var containers = List.of(
         PaletteItemUtil.node(UmlDeployment_DeploymentSpecification.typeId(), "DeploymentSpecification",
            "uml-deployment-specification-icon"),
         PaletteItemUtil.node(UmlDeployment_Artifact.typeId(), "Artifact", "uml-artifact-icon"),
         PaletteItemUtil.node(UmlDeployment_Device.typeId(), "Device", "uml-device-icon"),
         PaletteItemUtil.node(UmlDeployment_ExecutionEnvironment.typeId(), "ExecutionEnvironment",
            "uml-execution-environment-icon"),
         PaletteItemUtil.node(UmlDeployment_Model.typeId(), "Model", "uml-model-icon"),
         PaletteItemUtil.node(UmlDeployment_Node.typeId(), "Node", "uml-node-icon"),
         PaletteItemUtil.node(UmlDeployment_Package.typeId(), "Package", "uml-package-icon"));

      // TODO: implement Comment and Constraint in later development cycle
      // PaletteItemUtil.node(UmlDeployment_Comment.typeId(), "Comment", "uml-comment-icon"),
      // PaletteItemUtil.node(UmlDeployment_Constraint.typeId(), "Constraint", "uml-constraint-icon"));

      return PaletteItem.createPaletteGroup("uml.classifier", "Container", containers, "symbol-property");
   }

   private PaletteItem relations() {
      var relations = List.of(
         PaletteItemUtil.edge(UmlDeployment_Generalization.typeId(), "Generalization", "uml-generalization-icon"),
         PaletteItemUtil.edge(UmlDeployment_CommunicationPath.typeId(), "CommunicationPath",
            "uml-communication-path-icon"),
         PaletteItemUtil.edge(UmlDeployment_Dependency.typeId(), "Dependency", "uml-dependency-icon"),
         PaletteItemUtil.edge(UmlDeployment_Manifestation.typeId(), "Manifestation", "uml-manifestation-icon"),
         PaletteItemUtil.edge(UmlDeployment_Deployment.typeId(), "Deployment", "uml-deployment-icon"));

      return PaletteItem.createPaletteGroup("uml.classifier", "Relation", relations, "symbol-property");
   }

   private PaletteItem features() {
      var features = List.of(
         PaletteItemUtil.node(UmlDeployment_Property.typeId(), "Property", "uml-property-icon"),
         PaletteItemUtil.node(UmlDeployment_Operation.typeId(), "Operation", "uml-operation-icon"));

      return PaletteItem.createPaletteGroup("uml.classifier", "Feature", features, "symbol-property");
   }
}
