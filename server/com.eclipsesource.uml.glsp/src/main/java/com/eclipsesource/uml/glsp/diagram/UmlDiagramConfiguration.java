/********************************************************************************
 * Copyright (c) 2021-2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.diagram;

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

public class UmlDiagramConfiguration extends BaseDiagramConfiguration {

   @Override
   public String getDiagramType() {
      return "umldiagram";
   }

   @Override
   public List<EdgeTypeHint> getEdgeTypeHints() {
      return Lists.newArrayList(
            // COMMONS
            createDefaultEdgeTypeHint(Types.COMMENT_EDGE),

            // COMMUNICATION DIAGRAM
            new EdgeTypeHint(Types.MESSAGE, true, true, true, List.of(Types.LIFELINE), List.of(Types.LIFELINE)));
   }

   @Override
   public EdgeTypeHint createDefaultEdgeTypeHint(final String elementId) {
      List<String> allowed;

      ArrayList<String> from;
      ArrayList<String> to;

      switch (elementId) {
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
      hints.add(
            new ShapeTypeHint(DefaultTypes.GRAPH, false, false, false, false,
                  List.of(Types.INTERACTION)));
      // Comment
      hints.add(new ShapeTypeHint(Types.COMMENT, true, true, false, false));

      // Communication
      hints.add(new ShapeTypeHint(Types.INTERACTION, true, true, true, false, List.of(Types.LIFELINE)));
      hints.add(new ShapeTypeHint(Types.LIFELINE, true, true, false, false));
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

      // UML Communication
      mappings.put(Types.INTERACTION, GraphPackage.Literals.GNODE);
      mappings.put(Types.ICON_INTERACTION, GraphPackage.Literals.GCOMPARTMENT);
      mappings.put(Types.LIFELINE, GraphPackage.Literals.GNODE);
      mappings.put(Types.ICON_LIFELINE, GraphPackage.Literals.GCOMPARTMENT);
      mappings.put(Types.MESSAGE, GraphPackage.Literals.GEDGE);
      mappings.put(Types.MESSAGE_LABEL_ARROW_EDGE_NAME, GraphPackage.Literals.GLABEL);

      return mappings;
   }

   @Override
   public ServerLayoutKind getLayoutKind() {
      return ServerLayoutKind.MANUAL;
   }

}
