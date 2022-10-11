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
package com.eclipsesource.uml.glsp.old.diagram.usecase_diagram;

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

import com.eclipsesource.uml.glsp.old.diagram.usecase_diagram.constants.UseCaseTypes;
import com.google.common.collect.Lists;

public class UseCaseDiagramConfiguration extends BaseDiagramConfiguration {

   @Override
   public String getDiagramType() { return "umldiagram"; }

   @Override
   public List<EdgeTypeHint> getEdgeTypeHints() {
      return Lists.newArrayList(
         // USECASE DIAGRAM
         createDefaultEdgeTypeHint(UseCaseTypes.EXTEND),
         createDefaultEdgeTypeHint(UseCaseTypes.INCLUDE),
         createDefaultEdgeTypeHint(UseCaseTypes.GENERALIZATION),
         createDefaultEdgeTypeHint(UseCaseTypes.USECASE_ASSOCIATION));
   }

   @Override
   public EdgeTypeHint createDefaultEdgeTypeHint(final String elementId) {
      List<String> allowed;

      ArrayList<String> from;
      ArrayList<String> to;

      switch (elementId) {
         // USECASE DIAGRAM
         case UseCaseTypes.EXTEND:
            allowed = Lists.newArrayList(UseCaseTypes.USECASE, UseCaseTypes.EXTENSIONPOINT);
            return new EdgeTypeHint(elementId, true, true, true, allowed, allowed);
         case UseCaseTypes.INCLUDE:
            allowed = Lists.newArrayList(UseCaseTypes.USECASE);
            return new EdgeTypeHint(elementId, true, true, true, allowed, allowed);
         case UseCaseTypes.GENERALIZATION:
            allowed = Lists.newArrayList(UseCaseTypes.ACTOR, UseCaseTypes.USECASE);
            return new EdgeTypeHint(elementId, true, true, true, allowed, allowed);
         case UseCaseTypes.USECASE_ASSOCIATION:
            from = Lists.newArrayList(UseCaseTypes.ACTOR, UseCaseTypes.USECASE);
            to = Lists.newArrayList(UseCaseTypes.USECASE, UseCaseTypes.ACTOR);
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
         List.of(UseCaseTypes.USECASE,
            UseCaseTypes.ACTOR, UseCaseTypes.PACKAGE, UseCaseTypes.COMPONENT)));

      // USECASE DIAGRAM
      hints.add(new ShapeTypeHint(UseCaseTypes.PACKAGE, true, true, true, false,
         List.of(UseCaseTypes.ACTOR, UseCaseTypes.USECASE, UseCaseTypes.PACKAGE, UseCaseTypes.COMPONENT)));
      hints.add(new ShapeTypeHint(UseCaseTypes.COMPONENT, true, true, true, false,
         List.of(UseCaseTypes.USECASE)));
      hints.add(new ShapeTypeHint(UseCaseTypes.USECASE, true, true, false, false,
         List.of()));
      hints.add(new ShapeTypeHint(UseCaseTypes.EXTENSIONPOINT, false, true, false, false));
      hints.add(new ShapeTypeHint(UseCaseTypes.ACTOR, true, true, false, false,
         List.of()));

      return hints;
   }

   @Override
   public Map<String, EClass> getTypeMappings() {
      Map<String, EClass> mappings = DefaultTypes.getDefaultTypeMappings();

      // USECASE DIAGRAM
      mappings.put(UseCaseTypes.ICON_PACKAGE, GraphPackage.Literals.GCOMPARTMENT);
      mappings.put(UseCaseTypes.PACKAGE, GraphPackage.Literals.GNODE);
      mappings.put(UseCaseTypes.LABEL_PACKAGE_NAME, GraphPackage.Literals.GLABEL);
      mappings.put(UseCaseTypes.ICON_USECASE, GraphPackage.Literals.GCOMPARTMENT);
      mappings.put(UseCaseTypes.USECASE, GraphPackage.Literals.GNODE);
      mappings.put(UseCaseTypes.ICON_COMPONENT, GraphPackage.Literals.GCOMPARTMENT);
      mappings.put(UseCaseTypes.COMPONENT, GraphPackage.Literals.GNODE);
      mappings.put(UseCaseTypes.ICON_ACTOR, GraphPackage.Literals.GCOMPARTMENT);
      mappings.put(UseCaseTypes.ACTOR, GraphPackage.Literals.GNODE);
      mappings.put(UseCaseTypes.EXTEND, GraphPackage.Literals.GEDGE);
      mappings.put(UseCaseTypes.INCLUDE, GraphPackage.Literals.GEDGE);
      mappings.put(UseCaseTypes.GENERALIZATION, GraphPackage.Literals.GEDGE);

      // COMMON CANDIDATE
      mappings.put(UseCaseTypes.STRUCTURE, GraphPackage.Literals.GCOMPARTMENT);

      // SHARED WITH CLASS AND USECASE
      mappings.put(UseCaseTypes.LABEL_EDGE_MULTIPLICITY, GraphPackage.Literals.GLABEL);

      return mappings;
   }

   @Override
   public ServerLayoutKind getLayoutKind() { return ServerLayoutKind.MANUAL; }

}
