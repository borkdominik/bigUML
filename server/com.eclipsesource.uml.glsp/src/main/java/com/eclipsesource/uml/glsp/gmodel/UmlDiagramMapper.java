/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.gmodel;

import java.util.stream.Collectors;

import org.eclipse.glsp.graph.GGraph;
import org.eclipse.glsp.graph.GModelRoot;
import org.eclipse.glsp.graph.builder.impl.GGraphBuilder;
import org.eclipse.uml2.uml.Model;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.utils.UmlIDUtil;
import com.eclipsesource.uml.modelserver.unotation.Diagram;
import com.google.inject.Inject;

public class UmlDiagramMapper {
   @Inject
   private UmlGModelMapHandler mapHandler;

   @Inject
   private UmlModelState modelState;

   public GGraph map(final GGraph graph, final Diagram diagram) {
      if (diagram.getSemanticElement().getResolvedElement() != null) {
         Model umlModel = (Model) diagram.getSemanticElement().getResolvedElement();

         graph.setId(UmlIDUtil.toId(modelState, umlModel));
         graph.getChildren().addAll(umlModel.getPackagedElements().stream()
            .map(element -> mapHandler.handle(element))
            .collect(Collectors.toSet()));
      }

      return graph;
   }

   public GGraph reloadRoot(final Diagram diagram) {
      var graph = getOrCreateRoot();
      return map(graph, diagram);
   }

   /**
    * Creates and assigns the new root (graph) to the model state
    *
    * @param modelState
    * @return the assigned graph
    */
   public GGraph createRoot(final UmlModelState modelState) {
      GGraph graph = new GGraphBuilder().build();
      modelState.setRoot(graph);
      return graph;
   }

   // The root should be reused!
   protected GGraph getOrCreateRoot() {
      GModelRoot existingRoot = modelState.getRoot();
      if (existingRoot != null && existingRoot instanceof GGraph) {
         GGraph graph = (GGraph) existingRoot;
         graph.getChildren().clear();
         return graph;
      }
      return createRoot(modelState);
   }

}
