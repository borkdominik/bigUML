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
package com.borkdominik.big.glsp.uml.uml.representation.deployment;

import java.util.List;
import java.util.Map;

import org.eclipse.glsp.server.features.toolpalette.PaletteItem;

import com.borkdominik.big.glsp.server.core.features.tool_palette.BGBaseToolPaletteProvider;
import com.borkdominik.big.glsp.server.core.features.tool_palette.BGPaletteItemUtil;
import com.borkdominik.big.glsp.uml.uml.UMLTypes;
import com.borkdominik.big.glsp.uml.unotation.Representation;

public class DeploymentToolPaletteProvider extends BGBaseToolPaletteProvider {
   public DeploymentToolPaletteProvider() {
      super(Representation.DEPLOYMENT);
   }

   @Override
   public List<PaletteItem> getItems(final Map<String, String> args) {
      return List.of(containers(),
         relations(), features());
   }

   private PaletteItem containers() {
      var containers = List.of(
         BGPaletteItemUtil.node(UMLTypes.DEPLOYMENT_SPECIFICATION.prefix(representation), "DeploymentSpecification",
            "uml-deployment-specification-icon"),
         BGPaletteItemUtil.node(UMLTypes.ARTIFACT.prefix(representation), "Artifact",
            "uml-artifact-icon"),
         BGPaletteItemUtil.node(UMLTypes.DEVICE.prefix(representation), "Device", "uml-device-icon"),
         BGPaletteItemUtil.node(UMLTypes.EXECUTION_ENVIRONMENT.prefix(representation), "ExecutionEnvironment",
            "uml-execution-environment-icon"),
         BGPaletteItemUtil.node(UMLTypes.MODEL.prefix(representation), "Model", "uml-model-icon"),
         BGPaletteItemUtil.node(UMLTypes.NODE.prefix(representation), "Node", "uml-node-icon"),
         BGPaletteItemUtil.node(UMLTypes.PACKAGE.prefix(representation), "Package",
            "uml-package-icon"));

      // TODO: implement Comment and Constraint in later development cycle
      // BGPaletteItemUtil.node(configurationFor(Comment.class).typeId(), "Comment", "uml-comment-icon"),
      // BGPaletteItemUtil.node(configurationFor(Constraint.class).typeId(), "Constraint", "uml-constraint-icon"));

      return PaletteItem.createPaletteGroup("uml.classifier", "Container", containers, "symbol-property");
   }

   private PaletteItem relations() {
      var relations = List.of(
         BGPaletteItemUtil.edge(UMLTypes.GENERALIZATION.prefix(representation), "Generalization",
            "uml-generalization-icon"),
         BGPaletteItemUtil.edge(UMLTypes.COMMUNICATION_PATH.prefix(representation), "CommunicationPath",
            "uml-communication-path-icon"),
         BGPaletteItemUtil.edge(UMLTypes.DEPENDENCY.prefix(representation), "Dependency",
            "uml-dependency-icon"),
         BGPaletteItemUtil.edge(UMLTypes.MANIFESTATION.prefix(representation), "Manifestation",
            "uml-manifestation-icon"),
         BGPaletteItemUtil.edge(UMLTypes.DEPLOYMENT.prefix(representation), "Deployment",
            "uml-deployment-icon"));

      return PaletteItem.createPaletteGroup("uml.classifier", "Relation", relations, "symbol-property");
   }

   private PaletteItem features() {
      var features = List.of(
         BGPaletteItemUtil.node(UMLTypes.PROPERTY.prefix(representation), "Property",
            "uml-property-icon"),
         BGPaletteItemUtil.node(UMLTypes.OPERATION.prefix(representation), "Operation",
            "uml-operation-icon"));

      return PaletteItem.createPaletteGroup("uml.classifier", "Feature", features, "symbol-property");
   }
}
