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
package com.eclipsesource.uml.glsp.core.gmodel;

import java.util.ArrayList;

import org.eclipse.glsp.graph.GGraph;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.server.emf.EMFIdGenerator;
import org.eclipse.glsp.server.emf.model.notation.Diagram;
import org.eclipse.uml2.uml.Model;

import com.google.inject.Inject;

public class DiagramMapper {
   @Inject
   private GModelMapHandler mapHandler;

   @Inject
   protected EMFIdGenerator idGenerator;

   public GGraph map(final GGraph graph, final Diagram notationModel) {
      if (notationModel.getSemanticElement() != null
         && notationModel.getSemanticElement().getResolvedSemanticElement() != null) {
         var umlModel = (Model) notationModel.getSemanticElement().getResolvedSemanticElement();

         graph.setId(idGenerator.getOrCreateId(umlModel));
         umlModel.getPackagedElements().stream()
            .map(element -> {
               var current = mapHandler.handle(element);
               var siblings = mapHandler.handleSiblings(element);

               var gmodels = new ArrayList<GModelElement>();
               gmodels.add(current);
               gmodels.addAll(siblings);

               return gmodels;
            })
            .forEachOrdered(graph.getChildren()::addAll);
      }

      return graph;
   }
}
