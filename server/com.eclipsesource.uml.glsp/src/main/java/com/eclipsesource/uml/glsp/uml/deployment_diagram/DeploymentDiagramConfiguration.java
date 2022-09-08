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
package com.eclipsesource.uml.glsp.uml.deployment_diagram;

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

import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.google.common.collect.Lists;

public class DeploymentDiagramConfiguration extends BaseDiagramConfiguration {

   @Override
   public String getDiagramType() { return "umldiagram"; }

   @Override
   public List<EdgeTypeHint> getEdgeTypeHints() {
      return Lists.newArrayList(
         // COMMONS
         createDefaultEdgeTypeHint(Types.COMMENT_EDGE),
         // DEPLOYMENT DIAGRAM
         createDefaultEdgeTypeHint(Types.COMMUNICATION_PATH),
         createDefaultEdgeTypeHint(Types.DEPLOYMENT));
   }

   @Override
   public EdgeTypeHint createDefaultEdgeTypeHint(final String elementId) {
      List<String> allowed;

      ArrayList<String> from;
      ArrayList<String> to;

      switch (elementId) {
         // DEPLOYMENT DIAGRAM
         case Types.COMMUNICATION_PATH:
            from = Lists.newArrayList(Types.DEPLOYMENT_NODE, Types.EXECUTION_ENVIRONMENT, Types.DEVICE);
            to = Lists.newArrayList(Types.DEPLOYMENT_NODE, Types.EXECUTION_ENVIRONMENT, Types.DEVICE, Types.ARTIFACT,
               Types.DEPLOYMENT_SPECIFICATION);
            return new EdgeTypeHint(elementId, true, true, true, from, to);
         case Types.DEPLOYMENT:
            from = Lists.newArrayList(Types.ARTIFACT, Types.DEPLOYMENT_SPECIFICATION);
            to = Lists.newArrayList(Types.DEPLOYMENT_NODE, Types.DEVICE, Types.EXECUTION_ENVIRONMENT);
            return new EdgeTypeHint(elementId, true, true, true, from, to);
         // COMMENT
         case Types.COMMENT_EDGE:
            allowed = Lists.newArrayList();
            allowed.addAll(Types.LINKS_TO_COMMENT);
            return new EdgeTypeHint(elementId, true, true, true, List.of(Types.COMMENT),
               allowed);
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
         List.of(Types.COMMENT, Types.CLASS, Types.ACTIVITY, Types.USECASE, Types.ACTOR, Types.PACKAGE, Types.COMPONENT,
            Types.STATE_MACHINE, Types.DEPLOYMENT_NODE, Types.DEVICE, Types.ARTIFACT, Types.ENUMERATION,
            Types.EXECUTION_ENVIRONMENT, Types.OBJECT, Types.DEPLOYMENT_COMPONENT, Types.INTERFACE,
            Types.ABSTRACT_CLASS)));

      // DEPLOYMENT DIAGRAM
      hints.add(new ShapeTypeHint(Types.DEPLOYMENT_NODE, true, true, true, false,
         List.of(Types.DEPLOYMENT_NODE, Types.ARTIFACT, Types.DEVICE, Types.DEPLOYMENT_COMPONENT,
            Types.EXECUTION_ENVIRONMENT, Types.DEPLOYMENT_SPECIFICATION, Types.COMMENT)));
      hints.add(new ShapeTypeHint(Types.ARTIFACT, true, true, true, true,
         List.of(Types.DEPLOYMENT_SPECIFICATION, Types.COMMENT)));
      hints.add(new ShapeTypeHint(Types.EXECUTION_ENVIRONMENT, true, true, true, true,
         List.of(Types.DEPLOYMENT_NODE, Types.ARTIFACT, Types.DEVICE,
            Types.EXECUTION_ENVIRONMENT, Types.DEPLOYMENT_SPECIFICATION, Types.COMMENT)));
      hints.add(new ShapeTypeHint(Types.DEVICE, true, true, true, true,
         List.of(Types.DEPLOYMENT_NODE, Types.ARTIFACT, Types.DEVICE, Types.DEPLOYMENT_COMPONENT,
            Types.EXECUTION_ENVIRONMENT, Types.DEPLOYMENT_SPECIFICATION, Types.COMMENT)));
      hints.add(new ShapeTypeHint(Types.DEPLOYMENT_SPECIFICATION, true, true, true, true,
         List.of(Types.COMMENT)));
      hints.add(new ShapeTypeHint(Types.DEPLOYMENT_COMPONENT, true, true, true, true));

      // Comment
      hints.add(new ShapeTypeHint(Types.COMMENT, true, true, false, false));

      return hints;
   }

   @Override
   public Map<String, EClass> getTypeMappings() {
      Map<String, EClass> mappings = DefaultTypes.getDefaultTypeMappings();

      // COMMONS
      mappings.put(Types.LABEL_NAME, GraphPackage.Literals.GLABEL);
      mappings.put(Types.LABEL_TEXT, GraphPackage.Literals.GLABEL);
      mappings.put(Types.LABEL_EDGE_NAME, GraphPackage.Literals.GLABEL);
      mappings.put(Types.LABEL_EDGE_MULTIPLICITY, GraphPackage.Literals.GLABEL);
      mappings.put(Types.COMP, GraphPackage.Literals.GCOMPARTMENT);
      // mappings.put(Types.COMP_HEADER, GraphPackage.Literals.GCOMPARTMENT);
      mappings.put(Types.LABEL_ICON, GraphPackage.Literals.GCOMPARTMENT);
      mappings.put(Types.COMMENT, GraphPackage.Literals.GNODE);
      mappings.put(Types.COMMENT_EDGE, GraphPackage.Literals.GEDGE);
      mappings.put(Types.COMPARTMENT, GraphPackage.Literals.GCOMPARTMENT);
      mappings.put(Types.COMPARTMENT_HEADER, GraphPackage.Literals.GCOMPARTMENT);

      // DEPLOYMENT DIAGRAM
      mappings.put(Types.ICON_DEPLOYMENT_NODE, GraphPackage.Literals.GCOMPARTMENT);
      mappings.put(Types.DEPLOYMENT_NODE, GraphPackage.Literals.GNODE);
      mappings.put(Types.STRUCTURE, GraphPackage.Literals.GCOMPARTMENT);
      mappings.put(Types.LABEL_NODE_NAME, GraphPackage.Literals.GLABEL);
      mappings.put(Types.ICON_ARTIFACT, GraphPackage.Literals.GCOMPARTMENT);
      mappings.put(Types.ARTIFACT, GraphPackage.Literals.GNODE);
      mappings.put(Types.ICON_DEPLOYMENT_SPECIFICATION, GraphPackage.Literals.GCOMPARTMENT);
      mappings.put(Types.DEPLOYMENT_SPECIFICATION, GraphPackage.Literals.GNODE);
      mappings.put(Types.ICON_EXECUTION_ENVIRONMENT, GraphPackage.Literals.GCOMPARTMENT);
      mappings.put(Types.EXECUTION_ENVIRONMENT, GraphPackage.Literals.GNODE);
      mappings.put(Types.ICON_DEVICE, GraphPackage.Literals.GCOMPARTMENT);
      mappings.put(Types.DEVICE, GraphPackage.Literals.GNODE);
      mappings.put(Types.COMMUNICATION_PATH, GraphPackage.Literals.GEDGE);
      mappings.put(Types.DEPLOYMENT, GraphPackage.Literals.GEDGE);
      mappings.put(Types.DEPLOYMENT_COMPONENT, GraphPackage.Literals.GNODE);

      return mappings;
   }

   @Override
   public ServerLayoutKind getLayoutKind() { return ServerLayoutKind.MANUAL; }

}
