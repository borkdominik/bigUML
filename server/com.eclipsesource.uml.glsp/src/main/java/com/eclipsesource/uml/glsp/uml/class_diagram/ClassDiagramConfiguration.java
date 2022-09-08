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
package com.eclipsesource.uml.glsp.uml.class_diagram;

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

public class ClassDiagramConfiguration extends BaseDiagramConfiguration {

   @Override
   public String getDiagramType() { return "umldiagram"; }

   @Override
   public List<EdgeTypeHint> getEdgeTypeHints() {
      return Lists.newArrayList(
         // COMMONS
         createDefaultEdgeTypeHint(Types.COMMENT_EDGE),
         // CLASS DIAGRAM
         createDefaultEdgeTypeHint(Types.ASSOCIATION),
         createDefaultEdgeTypeHint(Types.AGGREGATION),
         createDefaultEdgeTypeHint(Types.COMPOSITION),
         createDefaultEdgeTypeHint(Types.CLASS_GENERALIZATION));
   }

   @Override
   public EdgeTypeHint createDefaultEdgeTypeHint(final String elementId) {
      List<String> allowed;

      ArrayList<String> from;
      ArrayList<String> to;

      switch (elementId) {
         // CLASS DIAGRAM
         case Types.ASSOCIATION:
         case Types.CLASS_GENERALIZATION:
            allowed = Lists.newArrayList(Types.CLASS, Types.INTERFACE);
            return new EdgeTypeHint(elementId, true, true, true, allowed, allowed);
         case Types.COMPOSITION:
         case Types.AGGREGATION:
            allowed = Lists.newArrayList(Types.CLASS);
            return new EdgeTypeHint(elementId, true, true, true, allowed, allowed);
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

      // CLASS DIAGRAM
      hints.add(new ShapeTypeHint(Types.CLASS, true, true, false, false,
         List.of(Types.PROPERTY, Types.COMMENT)));
      hints.add(new ShapeTypeHint(Types.ABSTRACT_CLASS, true, true, false, false,
         List.of(Types.PROPERTY, Types.COMMENT)));
      hints.add(new ShapeTypeHint(Types.INTERFACE, true, true, false, false,
         List.of(Types.PROPERTY, Types.COMMENT)));
      hints.add(new ShapeTypeHint(Types.PROPERTY, false, true, false, true,
         List.of(Types.COMMENT)));
      hints.add(new ShapeTypeHint(Types.PROPERTY, true, true, false, false));

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

      // CLASS DIAGRAM
      mappings.put(Types.ICON_CLASS, GraphPackage.Literals.GCOMPARTMENT);
      mappings.put(Types.CLASS, GraphPackage.Literals.GNODE);
      mappings.put(Types.ICON_ENUMERATION, GraphPackage.Literals.GCOMPARTMENT);
      mappings.put(Types.ENUMERATION, GraphPackage.Literals.GNODE);
      mappings.put(Types.INTERFACE, GraphPackage.Literals.GNODE);
      // mappings.put(Types.PROPERTY, GraphPackage.Literals.GLABEL);
      mappings.put(Types.ASSOCIATION, GraphPackage.Literals.GEDGE);
      mappings.put(Types.AGGREGATION, GraphPackage.Literals.GEDGE);
      mappings.put(Types.COMPOSITION, GraphPackage.Literals.GEDGE);
      mappings.put(Types.CLASS_GENERALIZATION, GraphPackage.Literals.GEDGE);
      mappings.put(Types.PROPERTY, GraphPackage.Literals.GCOMPARTMENT);
      mappings.put(Types.ICON_PROPERTY, GraphPackage.Literals.GCOMPARTMENT);
      mappings.put(Types.LABEL_PROPERTY_NAME, GraphPackage.Literals.GLABEL);
      mappings.put(Types.LABEL_PROPERTY_TYPE, GraphPackage.Literals.GLABEL);
      mappings.put(Types.LABEL_PROPERTY_MULTIPLICITY, GraphPackage.Literals.GLABEL);

      return mappings;
   }

   @Override
   public ServerLayoutKind getLayoutKind() { return ServerLayoutKind.MANUAL; }

}
