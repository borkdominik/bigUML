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
package com.eclipsesource.uml.glsp.old.diagram.deployment_diagram;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.eclipse.emf.ecore.EClass;
import org.eclipse.glsp.graph.DefaultTypes;
import org.eclipse.glsp.graph.GraphPackage;
import org.eclipse.glsp.server.diagram.BaseDiagramConfiguration;
import org.eclipse.glsp.server.layout.ServerLayoutKind;
import org.eclipse.glsp.server.types.EdgeTypeHint;
import org.eclipse.glsp.server.types.ShapeTypeHint;

import com.eclipsesource.uml.glsp.old.diagram.deployment_diagram.constants.DeploymentTypes;
import com.google.common.collect.Lists;

public class DeploymentDiagramConfiguration extends BaseDiagramConfiguration {

   @Override
   public String getDiagramType() { return "umldiagram"; }

   @Override
   public List<EdgeTypeHint> getEdgeTypeHints() {
      return Lists.newArrayList(
         // DEPLOYMENT DIAGRAM
         createDefaultEdgeTypeHint(DeploymentTypes.COMMUNICATION_PATH),
         createDefaultEdgeTypeHint(DeploymentTypes.DEPLOYMENT));
   }

   @Override
   public EdgeTypeHint createDefaultEdgeTypeHint(final String elementId) {
      List<String> allowed;

      ArrayList<String> from;
      ArrayList<String> to;

      switch (elementId) {
         // DEPLOYMENT DIAGRAM
         case DeploymentTypes.COMMUNICATION_PATH:
            from = Lists.newArrayList(DeploymentTypes.DEPLOYMENT_NODE, DeploymentTypes.EXECUTION_ENVIRONMENT,
               DeploymentTypes.DEVICE);
            to = Lists.newArrayList(DeploymentTypes.DEPLOYMENT_NODE, DeploymentTypes.EXECUTION_ENVIRONMENT,
               DeploymentTypes.DEVICE, DeploymentTypes.ARTIFACT,
               DeploymentTypes.DEPLOYMENT_SPECIFICATION);
            return new EdgeTypeHint(elementId, true, true, true, from, to);
         case DeploymentTypes.DEPLOYMENT:
            from = Lists.newArrayList(DeploymentTypes.ARTIFACT, DeploymentTypes.DEPLOYMENT_SPECIFICATION);
            to = Lists.newArrayList(DeploymentTypes.DEPLOYMENT_NODE, DeploymentTypes.DEVICE,
               DeploymentTypes.EXECUTION_ENVIRONMENT);
            return new EdgeTypeHint(elementId, true, true, true, from, to);
         default:
            break;
      }
      return new EdgeTypeHint(elementId, true, true, true, List.of(), List.of());
   }

   @Override
   public List<ShapeTypeHint> getShapeTypeHints() {
      List<ShapeTypeHint> hints = new ArrayList<>();
      // GRAPH
      hints.add(new ShapeTypeHint(DefaultTypes.GRAPH, false, false, false, false,
         List.of(DeploymentTypes.DEPLOYMENT_NODE, DeploymentTypes.DEVICE,
            DeploymentTypes.ARTIFACT,
            DeploymentTypes.EXECUTION_ENVIRONMENT, DeploymentTypes.DEPLOYMENT_COMPONENT)));

      // DEPLOYMENT DIAGRAM
      hints.add(new ShapeTypeHint(DeploymentTypes.DEPLOYMENT_NODE, true, true, true, false,
         List.of(DeploymentTypes.DEPLOYMENT_NODE, DeploymentTypes.ARTIFACT, DeploymentTypes.DEVICE,
            DeploymentTypes.DEPLOYMENT_COMPONENT,
            DeploymentTypes.EXECUTION_ENVIRONMENT, DeploymentTypes.DEPLOYMENT_SPECIFICATION)));
      hints.add(new ShapeTypeHint(DeploymentTypes.ARTIFACT, true, true, true, true,
         List.of(DeploymentTypes.DEPLOYMENT_SPECIFICATION)));
      hints.add(new ShapeTypeHint(DeploymentTypes.EXECUTION_ENVIRONMENT, true, true, true, true,
         List.of(DeploymentTypes.DEPLOYMENT_NODE, DeploymentTypes.ARTIFACT, DeploymentTypes.DEVICE,
            DeploymentTypes.EXECUTION_ENVIRONMENT, DeploymentTypes.DEPLOYMENT_SPECIFICATION)));
      hints.add(new ShapeTypeHint(DeploymentTypes.DEVICE, true, true, true, true,
         List.of(DeploymentTypes.DEPLOYMENT_NODE, DeploymentTypes.ARTIFACT, DeploymentTypes.DEVICE,
            DeploymentTypes.DEPLOYMENT_COMPONENT,
            DeploymentTypes.EXECUTION_ENVIRONMENT, DeploymentTypes.DEPLOYMENT_SPECIFICATION)));
      hints.add(new ShapeTypeHint(DeploymentTypes.DEPLOYMENT_SPECIFICATION, true, true, true, true,
         List.of()));
      hints.add(new ShapeTypeHint(DeploymentTypes.DEPLOYMENT_COMPONENT, true, true, true, true));

      return hints;
   }

   @Override
   public Map<String, EClass> getTypeMappings() {
      Map<String, EClass> mappings = DefaultTypes.getDefaultTypeMappings();

      // DEPLOYMENT DIAGRAM
      mappings.put(DeploymentTypes.ICON_DEPLOYMENT_NODE, GraphPackage.Literals.GCOMPARTMENT);
      mappings.put(DeploymentTypes.DEPLOYMENT_NODE, GraphPackage.Literals.GNODE);
      mappings.put(DeploymentTypes.STRUCTURE, GraphPackage.Literals.GCOMPARTMENT);
      mappings.put(DeploymentTypes.LABEL_NODE_NAME, GraphPackage.Literals.GLABEL);
      mappings.put(DeploymentTypes.ICON_ARTIFACT, GraphPackage.Literals.GCOMPARTMENT);
      mappings.put(DeploymentTypes.ARTIFACT, GraphPackage.Literals.GNODE);
      mappings.put(DeploymentTypes.ICON_DEPLOYMENT_SPECIFICATION, GraphPackage.Literals.GCOMPARTMENT);
      mappings.put(DeploymentTypes.DEPLOYMENT_SPECIFICATION, GraphPackage.Literals.GNODE);
      mappings.put(DeploymentTypes.ICON_EXECUTION_ENVIRONMENT, GraphPackage.Literals.GCOMPARTMENT);
      mappings.put(DeploymentTypes.EXECUTION_ENVIRONMENT, GraphPackage.Literals.GNODE);
      mappings.put(DeploymentTypes.ICON_DEVICE, GraphPackage.Literals.GCOMPARTMENT);
      mappings.put(DeploymentTypes.DEVICE, GraphPackage.Literals.GNODE);
      mappings.put(DeploymentTypes.COMMUNICATION_PATH, GraphPackage.Literals.GEDGE);
      mappings.put(DeploymentTypes.DEPLOYMENT, GraphPackage.Literals.GEDGE);
      mappings.put(DeploymentTypes.DEPLOYMENT_COMPONENT, GraphPackage.Literals.GNODE);

      // COMMON CANDIDATE
      mappings.put(DeploymentTypes.STRUCTURE, GraphPackage.Literals.GCOMPARTMENT);

      // SHARED WITH CLASS AND USECASE
      mappings.put(DeploymentTypes.LABEL_EDGE_MULTIPLICITY, GraphPackage.Literals.GLABEL);

      return mappings;
   }

   @Override
   public ServerLayoutKind getLayoutKind() { return ServerLayoutKind.MANUAL; }

}
