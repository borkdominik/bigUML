/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.gmodel;

import java.util.List;

import org.eclipse.glsp.graph.GEdge;
import org.eclipse.glsp.graph.builder.impl.GEdgeBuilder;
import org.eclipse.glsp.graph.builder.impl.GEdgePlacementBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.Include;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.diagram.UmlUseCase_Include;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGEdgeMapper;
import com.eclipsesource.uml.glsp.uml.gmodel.element.EdgeGBuilder;

public final class IncludeEdgeMapper extends BaseGEdgeMapper<Include, GEdge> implements EdgeGBuilder {

   @Override
   public GEdge map(final Include source) {
      var including = source.getIncludingCase();
      var includingId = idGenerator.getOrCreateId(including);
      var addition = source.getAddition();
      var additionId = idGenerator.getOrCreateId(addition);

      GEdgeBuilder builder = new GEdgeBuilder(UmlUseCase_Include.typeId())
         .id(idGenerator.getOrCreateId(source))
         .addCssClasses(List.of(CoreCSS.EDGE, CoreCSS.EDGE_DASHED))
         .addCssClass(CoreCSS.Marker.TENT.end())
         .sourceId(includingId)
         .targetId(additionId)
         .routerKind(GConstants.RouterKind.POLYLINE)
         .add(textEdgeBuilder(
            source,
            "<<include>>",
            new GEdgePlacementBuilder()
               .side(GConstants.EdgeSide.TOP)
               .position(0.5d)
               .rotate(false)
               .build())
                  .build());

      applyEdgeNotation(source, builder);

      return builder.build();
   }
}
