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
package com.eclipsesource.uml.glsp.uml.object_diagram;

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

import com.eclipsesource.uml.glsp.uml.class_diagram.constants.ClassTypes;
import com.eclipsesource.uml.glsp.uml.object_diagram.constants.ObjectTypes;
import com.google.common.collect.Lists;

public class ObjectDiagramConfiguration extends BaseDiagramConfiguration {

   @Override
   public String getDiagramType() { return "umldiagram"; }

   @Override
   public List<EdgeTypeHint> getEdgeTypeHints() {
      return Lists.newArrayList(
         // OBJECT DIAGRAM
         createDefaultEdgeTypeHint(ObjectTypes.LINK));
   }

   @Override
   public EdgeTypeHint createDefaultEdgeTypeHint(final String elementId) {
      List<String> allowed;

      ArrayList<String> from;
      ArrayList<String> to;

      switch (elementId) {
         // OBJECT DIAGRAM
         case ObjectTypes.LINK:
            allowed = Lists.newArrayList(ObjectTypes.OBJECT, ClassTypes.CLASS);
            return new EdgeTypeHint(elementId, true, true, true, allowed, allowed);
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
         List.of(ObjectTypes.OBJECT)));

      // OBJECT DIAGRAM
      hints.add(new ShapeTypeHint(ObjectTypes.OBJECT, true, true, false, false,
         List.of(ObjectTypes.ATTRIBUTE)));
      hints.add(new ShapeTypeHint(ObjectTypes.ATTRIBUTE, false, true, false, true));

      return hints;
   }

   @Override
   public Map<String, EClass> getTypeMappings() {
      Map<String, EClass> mappings = DefaultTypes.getDefaultTypeMappings();

      // OBJECT DIAGRAM
      mappings.put(ObjectTypes.ICON_OBJECT, GraphPackage.Literals.GCOMPARTMENT);
      mappings.put(ObjectTypes.OBJECT, GraphPackage.Literals.GNODE);
      mappings.put(ObjectTypes.LINK, GraphPackage.Literals.GEDGE);
      mappings.put(ObjectTypes.ATTRIBUTE, GraphPackage.Literals.GLABEL);

      // SHARED WITH OBJECT DIAGRAM
      mappings.put(ObjectTypes.ATTRIBUTE, GraphPackage.Literals.GLABEL);
      mappings.put(ObjectTypes.PROPERTY, GraphPackage.Literals.GCOMPARTMENT);

      return mappings;
   }

   @Override
   public ServerLayoutKind getLayoutKind() { return ServerLayoutKind.MANUAL; }

}
