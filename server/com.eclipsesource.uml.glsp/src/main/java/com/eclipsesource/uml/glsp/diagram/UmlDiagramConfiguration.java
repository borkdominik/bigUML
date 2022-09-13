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
import java.util.Set;
import java.util.stream.Collectors;

import org.eclipse.emf.ecore.EClass;
import org.eclipse.glsp.graph.DefaultTypes;
import org.eclipse.glsp.graph.GraphPackage;
import org.eclipse.glsp.server.diagram.BaseDiagramConfiguration;
import org.eclipse.glsp.server.layout.ServerLayoutKind;
import org.eclipse.glsp.server.types.EdgeTypeHint;
import org.eclipse.glsp.server.types.ShapeTypeHint;

import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.google.common.collect.Lists;
import com.google.inject.Inject;

public class UmlDiagramConfiguration extends BaseDiagramConfiguration {

   @Inject
   private Set<UmlDiagramConfigurationProvider> diagramConfigurationProviders;

   @Override
   public String getDiagramType() { return "umldiagram"; }

   @Override
   public List<EdgeTypeHint> getEdgeTypeHints() {
      var hints = Lists.newArrayList(
         // COMMONS
         createDefaultEdgeTypeHint(Types.COMMENT_EDGE));

      hints.addAll(diagramConfigurationProviders.stream()
         .flatMap(provider -> provider.getEdgeTypeHints().stream())
         .collect(Collectors.toList()));

      return hints;
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

      var graphContainableElements = diagramConfigurationProviders.stream()
         .flatMap(provider -> provider.getGraphContainableElements().stream())
         .collect(Collectors.toList());

      hints.add(
         new ShapeTypeHint(DefaultTypes.GRAPH, false, false, false, false,
            graphContainableElements));
      hints.add(new ShapeTypeHint(Types.COMMENT, true, true, false, false));

      hints.addAll(diagramConfigurationProviders.stream()
         .flatMap(provider -> provider.getShapeTypeHints().stream())
         .collect(Collectors.toList()));

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

      diagramConfigurationProviders.stream().map(provider -> provider.getTypeMappings()).forEach(typeMappings -> {
         mappings.putAll(typeMappings);
      });
      return mappings;
   }

   @Override
   public ServerLayoutKind getLayoutKind() { return ServerLayoutKind.MANUAL; }

}
