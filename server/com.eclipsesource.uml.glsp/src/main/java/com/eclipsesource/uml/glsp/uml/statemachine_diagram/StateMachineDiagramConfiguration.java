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
package com.eclipsesource.uml.glsp.uml.statemachine_diagram;

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

public class StateMachineDiagramConfiguration extends BaseDiagramConfiguration {

   @Override
   public String getDiagramType() { return "umldiagram"; }

   @Override
   public List<EdgeTypeHint> getEdgeTypeHints() {
      return Lists.newArrayList(
         // COMMONS
         createDefaultEdgeTypeHint(Types.COMMENT_EDGE),
         // STATE MACHINE DIAGRAM
         createDefaultEdgeTypeHint(Types.TRANSITION));
   }

   @Override
   public EdgeTypeHint createDefaultEdgeTypeHint(final String elementId) {
      List<String> allowed;

      ArrayList<String> from;
      ArrayList<String> to;

      switch (elementId) {
         // STATE MACHINE DIAGRAM
         case Types.TRANSITION:
            allowed = Lists.newArrayList(Types.STATE, Types.FINAL_STATE);
            allowed.addAll(Types.PSEUDOSTATES);
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

      // STATE MACHINE DIAGRAM
      hints.add(new ShapeTypeHint(Types.STATE_MACHINE, true, true, true, false,
         List.of(Types.REGION, Types.STATE, Types.INITIAL_STATE, Types.DEEP_HISTORY, Types.SHALLOW_HISTORY, Types.FORK,
            Types.JOIN,
            Types.JUNCTION, Types.CHOICE, Types.ENTRY_POINT, Types.EXIT_POINT, Types.TERMINATE, Types.FINAL_STATE,
            Types.COMMENT)));
      hints.add(new ShapeTypeHint(Types.REGION, true, true, true, true,
         List.of(Types.STATE, Types.INITIAL_STATE, Types.DEEP_HISTORY, Types.SHALLOW_HISTORY, Types.FORK, Types.JOIN,
            Types.JUNCTION, Types.CHOICE, Types.ENTRY_POINT, Types.EXIT_POINT, Types.TERMINATE, Types.FINAL_STATE,
            Types.COMMENT)));
      hints.add(new ShapeTypeHint(Types.STATE, true, true, true, false,
         List.of(Types.ENTRY_POINT, Types.EXIT_POINT, Types.STATE_ENTRY_ACTIVITY, Types.STATE_DO_ACTIVITY,
            Types.STATE_EXIT_ACTIVITY, Types.COMMENT, Types.REGION)));
      hints.add(new ShapeTypeHint(Types.INITIAL_STATE, true, true, true, false,
         List.of(Types.COMMENT)));
      hints.add(new ShapeTypeHint(Types.DEEP_HISTORY, true, true, true, false,
         List.of(Types.COMMENT)));
      hints.add(new ShapeTypeHint(Types.SHALLOW_HISTORY, true, true, true, false,
         List.of(Types.COMMENT)));
      hints.add(new ShapeTypeHint(Types.FORK, true, true, true, false,
         List.of(Types.COMMENT)));
      hints.add(new ShapeTypeHint(Types.JOIN, true, true, true, false,
         List.of(Types.COMMENT)));
      hints.add(new ShapeTypeHint(Types.JUNCTION, true, true, true, false,
         List.of(Types.COMMENT)));
      hints.add(new ShapeTypeHint(Types.CHOICE, true, true, true, false,
         List.of(Types.COMMENT)));
      hints.add(new ShapeTypeHint(Types.STATE_ENTRY_ACTIVITY, false, true, false, true,
         List.of(Types.COMMENT)));
      hints.add(new ShapeTypeHint(Types.STATE_DO_ACTIVITY, false, true, false, true,
         List.of(Types.COMMENT)));
      hints.add(new ShapeTypeHint(Types.STATE_EXIT_ACTIVITY, false, true, false, true,
         List.of(Types.COMMENT)));
      hints.add(new ShapeTypeHint(Types.FINAL_STATE, true, true, true, false,
         List.of(Types.COMMENT)));
      hints.add(new ShapeTypeHint(Types.ENTRY_POINT, true, true, false, false,
         List.of(Types.COMMENT)));
      hints.add(new ShapeTypeHint(Types.EXIT_POINT, true, true, false, false,
         List.of(Types.COMMENT)));
      hints.add(new ShapeTypeHint(Types.TERMINATE, true, true, true, false,
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

      // STATE MACHINE DIAGRAM
      mappings.put(Types.ICON_STATE_MACHINE, GraphPackage.Literals.GCOMPARTMENT);
      mappings.put(Types.STATE_MACHINE, GraphPackage.Literals.GNODE);
      mappings.put(Types.REGION, GraphPackage.Literals.GNODE);
      mappings.put(Types.ICON_STATE, GraphPackage.Literals.GCOMPARTMENT);
      mappings.put(Types.STATE, GraphPackage.Literals.GNODE);
      mappings.put(Types.LABEL_VERTEX_NAME, GraphPackage.Literals.GLABEL);
      mappings.put(Types.INITIAL_STATE, GraphPackage.Literals.GNODE);
      mappings.put(Types.DEEP_HISTORY, GraphPackage.Literals.GNODE);
      mappings.put(Types.SHALLOW_HISTORY, GraphPackage.Literals.GNODE);
      mappings.put(Types.JOIN, GraphPackage.Literals.GNODE);
      mappings.put(Types.FORK, GraphPackage.Literals.GNODE);
      mappings.put(Types.JUNCTION, GraphPackage.Literals.GNODE);
      mappings.put(Types.CHOICE, GraphPackage.Literals.GNODE);
      mappings.put(Types.ENTRY_POINT, GraphPackage.Literals.GNODE);
      mappings.put(Types.EXIT_POINT, GraphPackage.Literals.GNODE);
      mappings.put(Types.TERMINATE, GraphPackage.Literals.GNODE);
      mappings.put(Types.FINAL_STATE, GraphPackage.Literals.GNODE);
      mappings.put(Types.STATE_ENTRY_ACTIVITY, GraphPackage.Literals.GLABEL);
      mappings.put(Types.STATE_DO_ACTIVITY, GraphPackage.Literals.GLABEL);
      mappings.put(Types.STATE_EXIT_ACTIVITY, GraphPackage.Literals.GLABEL);
      mappings.put(Types.TRANSITION, GraphPackage.Literals.GEDGE);

      return mappings;
   }

   @Override
   public ServerLayoutKind getLayoutKind() { return ServerLayoutKind.MANUAL; }

}
