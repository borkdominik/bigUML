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
package com.eclipsesource.uml.glsp.uml.representation.deployment;

import java.util.List;
import java.util.Map;

import org.eclipse.glsp.server.features.toolpalette.PaletteItem;
import org.eclipse.uml2.uml.Artifact;
import org.eclipse.uml2.uml.CommunicationPath;
import org.eclipse.uml2.uml.Dependency;
import org.eclipse.uml2.uml.Deployment;
import org.eclipse.uml2.uml.DeploymentSpecification;
import org.eclipse.uml2.uml.Device;
import org.eclipse.uml2.uml.ExecutionEnvironment;
import org.eclipse.uml2.uml.Generalization;
import org.eclipse.uml2.uml.Manifestation;
import org.eclipse.uml2.uml.Model;
import org.eclipse.uml2.uml.Node;

import com.eclipsesource.uml.glsp.core.features.tool_palette.PaletteItemUtil;
import com.eclipsesource.uml.glsp.uml.features.tool_palette.RepresentationToolPaletteConfiguration;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public final class DeploymentToolPaletteConfiguration extends RepresentationToolPaletteConfiguration {
   public DeploymentToolPaletteConfiguration() {
      super(Representation.DEPLOYMENT);
   }

   @Override
   public List<PaletteItem> getItems(final Map<String, String> args) {
      return List.of(containers(),
         relations());
   }

   private PaletteItem containers() {
      var containers = List.of(
         PaletteItemUtil.node(configurationFor(DeploymentSpecification.class).typeId(), "DeploymentSpecification",
            "uml-deployment-specification-icon"),
         PaletteItemUtil.node(configurationFor(Artifact.class).typeId(), "Artifact", "uml-artifact-icon"),
         PaletteItemUtil.node(configurationFor(Device.class).typeId(), "Device", "uml-device-icon"),
         PaletteItemUtil.node(configurationFor(ExecutionEnvironment.class).typeId(), "ExecutionEnvironment",
            "uml-execution-environment-icon"),
         PaletteItemUtil.node(configurationFor(Model.class).typeId(), "Model", "uml-model-icon"),
         PaletteItemUtil.node(configurationFor(Node.class).typeId(), "Node", "uml-node-icon"),
         PaletteItemUtil.node(configurationFor(org.eclipse.uml2.uml.Package.class).typeId(), "Package",
            "uml-package-icon"));

      // TODO: implement Comment and Constraint in later development cycle
      // PaletteItemUtil.node(configurationFor(Comment.class).typeId(), "Comment", "uml-comment-icon"),
      // PaletteItemUtil.node(configurationFor(Constraint.class).typeId(), "Constraint", "uml-constraint-icon"));

      return PaletteItem.createPaletteGroup("uml.classifier", "Container", containers, "symbol-property");
   }

   private PaletteItem relations() {
      var relations = List.of(
         PaletteItemUtil.edge(configurationFor(Generalization.class).typeId(), "Generalization",
            "uml-generalization-icon"),
         PaletteItemUtil.edge(configurationFor(CommunicationPath.class).typeId(), "CommunicationPath",
            "uml-communication-path-icon"),
         PaletteItemUtil.edge(configurationFor(Dependency.class).typeId(), "Dependency", "uml-dependency-icon"),
         PaletteItemUtil.edge(configurationFor(Manifestation.class).typeId(), "Manifestation",
            "uml-manifestation-icon"),
         PaletteItemUtil.edge(configurationFor(Deployment.class).typeId(), "Deployment", "uml-deployment-icon"));

      return PaletteItem.createPaletteGroup("uml.classifier", "Relation", relations, "symbol-property");
   }
}
