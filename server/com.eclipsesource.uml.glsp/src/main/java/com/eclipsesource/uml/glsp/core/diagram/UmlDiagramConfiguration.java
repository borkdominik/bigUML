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
package com.eclipsesource.uml.glsp.core.diagram;

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

import com.eclipsesource.uml.glsp.core.constants.CoreTypes;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;

public class UmlDiagramConfiguration extends BaseDiagramConfiguration {

   @Inject
   protected Map<Representation, DiagramConfiguration> diagramConfigurations;
   @Inject
   protected Map<Representation, Set<DiagramElementConfiguration.Node>> nodeConfigurations;
   @Inject
   protected Map<Representation, Set<DiagramElementConfiguration.Edge>> edgeConfigurations;

   @Override
   public List<EdgeTypeHint> getEdgeTypeHints() {
      var hints = diagramConfigurations.values().stream()
         .flatMap(contribution -> contribution.getEdgeTypeHints().stream())
         .collect(Collectors.toList());

      edgeConfigurations.values().stream().flatMap(c -> c.stream())
         .flatMap(c -> c.getEdgeTypeHints().stream())
         .forEach(hints::add);

      return hints;
   }

   @Override
   public List<ShapeTypeHint> getShapeTypeHints() {
      List<ShapeTypeHint> hints = new ArrayList<>();

      var graphContainableElements = diagramConfigurations.values().stream()
         .flatMap(contribution -> contribution.getGraphContainableElements().stream())
         .collect(Collectors.toList());

      nodeConfigurations.values().stream().flatMap(c -> c.stream())
         .flatMap(c -> c.getGraphContainableElements().stream())
         .forEach(graphContainableElements::add);

      hints.add(
         new ShapeTypeHint(DefaultTypes.GRAPH, false, false, false, false,
            graphContainableElements));

      diagramConfigurations.values().stream()
         .flatMap(contribution -> contribution.getShapeTypeHints().stream())
         .forEach(hints::add);

      nodeConfigurations.values().stream().flatMap(c -> c.stream())
         .flatMap(c -> c.getShapeTypeHints().stream())
         .forEach(hints::add);

      return hints;
   }

   @Override
   public Map<String, EClass> getTypeMappings() {
      Map<String, EClass> mappings = DefaultTypes.getDefaultTypeMappings();

      // COMMONS
      mappings.put(CoreTypes.LABEL_NAME, GraphPackage.Literals.GLABEL);
      mappings.put(CoreTypes.LABEL_TEXT, GraphPackage.Literals.GLABEL);
      mappings.put(CoreTypes.LABEL_EDGE_NAME, GraphPackage.Literals.GLABEL);
      mappings.put(CoreTypes.ICON_CSS, GraphPackage.Literals.GCOMPARTMENT);

      diagramConfigurations.values().stream().map(contribution -> contribution.getTypeMappings())
         .forEach(typeMappings -> {
            mappings.putAll(typeMappings);
         });

      edgeConfigurations.values().stream().flatMap(c -> c.stream())
         .map(c -> c.getTypeMappings())
         .forEach(typeMappings -> {
            mappings.putAll(typeMappings);
         });

      return mappings;
   }

   @Override
   public ServerLayoutKind getLayoutKind() { return ServerLayoutKind.MANUAL; }
}
