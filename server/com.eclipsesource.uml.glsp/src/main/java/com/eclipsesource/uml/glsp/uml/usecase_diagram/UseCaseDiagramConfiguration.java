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
package com.eclipsesource.uml.glsp.uml.usecase_diagram;

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

public class UseCaseDiagramConfiguration extends BaseDiagramConfiguration {

   @Override
   public String getDiagramType() { return "umldiagram"; }

   @Override
   public List<EdgeTypeHint> getEdgeTypeHints() {
      return Lists.newArrayList(
         // COMMONS
         createDefaultEdgeTypeHint(Types.COMMENT_EDGE),
         // USECASE DIAGRAM
         createDefaultEdgeTypeHint(Types.EXTEND),
         createDefaultEdgeTypeHint(Types.INCLUDE),
         createDefaultEdgeTypeHint(Types.GENERALIZATION),
         createDefaultEdgeTypeHint(Types.USECASE_ASSOCIATION));
   }

   @Override
   public EdgeTypeHint createDefaultEdgeTypeHint(final String elementId) {
      List<String> allowed;

      ArrayList<String> from;
      ArrayList<String> to;

      switch (elementId) {
         // USECASE DIAGRAM
         case Types.EXTEND:
            allowed = Lists.newArrayList(Types.USECASE, Types.EXTENSIONPOINT);
            return new EdgeTypeHint(elementId, true, true, true, allowed, allowed);
         case Types.INCLUDE:
            allowed = Lists.newArrayList(Types.USECASE);
            return new EdgeTypeHint(elementId, true, true, true, allowed, allowed);
         case Types.GENERALIZATION:
            allowed = Lists.newArrayList(Types.ACTOR, Types.USECASE);
            return new EdgeTypeHint(elementId, true, true, true, allowed, allowed);
         case Types.USECASE_ASSOCIATION:
            from = Lists.newArrayList(Types.ACTOR, Types.USECASE);
            to = Lists.newArrayList(Types.USECASE, Types.ACTOR);
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

      // USECASE DIAGRAM
      hints.add(new ShapeTypeHint(Types.PACKAGE, true, true, true, false,
         List.of(Types.ACTOR, Types.USECASE, Types.PACKAGE, Types.COMPONENT, Types.COMMENT)));
      hints.add(new ShapeTypeHint(Types.COMPONENT, true, true, true, false,
         List.of(Types.USECASE, Types.COMMENT)));
      hints.add(new ShapeTypeHint(Types.USECASE, true, true, false, false,
         List.of(Types.COMMENT)));
      hints.add(new ShapeTypeHint(Types.EXTENSIONPOINT, false, true, false, false));
      hints.add(new ShapeTypeHint(Types.ACTOR, true, true, false, false,
         List.of(Types.COMMENT)));

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

      // USECASE DIAGRAM
      mappings.put(Types.ICON_PACKAGE, GraphPackage.Literals.GCOMPARTMENT);
      mappings.put(Types.PACKAGE, GraphPackage.Literals.GNODE);
      mappings.put(Types.LABEL_PACKAGE_NAME, GraphPackage.Literals.GLABEL);
      mappings.put(Types.ICON_USECASE, GraphPackage.Literals.GCOMPARTMENT);
      mappings.put(Types.USECASE, GraphPackage.Literals.GNODE);
      mappings.put(Types.ICON_COMPONENT, GraphPackage.Literals.GCOMPARTMENT);
      mappings.put(Types.COMPONENT, GraphPackage.Literals.GNODE);
      mappings.put(Types.ICON_ACTOR, GraphPackage.Literals.GCOMPARTMENT);
      mappings.put(Types.ACTOR, GraphPackage.Literals.GNODE);
      mappings.put(Types.EXTEND, GraphPackage.Literals.GEDGE);
      mappings.put(Types.INCLUDE, GraphPackage.Literals.GEDGE);
      mappings.put(Types.GENERALIZATION, GraphPackage.Literals.GEDGE);

      return mappings;
   }

   @Override
   public ServerLayoutKind getLayoutKind() { return ServerLayoutKind.MANUAL; }

}
