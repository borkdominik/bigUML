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
import org.eclipse.uml2.uml.Extend;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.diagram.UmlUseCase_Extend;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGEdgeMapper;
import com.eclipsesource.uml.glsp.uml.gmodel.element.EdgeGBuilder;

public class ExtendEdgeMapper extends BaseGEdgeMapper<Extend, GEdge> implements EdgeGBuilder {

   @Override
   public GEdge map(final Extend source) {
      var extending = source.getExtension();
      var extendingId = idGenerator.getOrCreateId(extending);
      var extended = source.getExtendedCase();
      var extendedId = idGenerator.getOrCreateId(extended);

      GEdgeBuilder builder = new GEdgeBuilder(UmlUseCase_Extend.typeId())
         .id(idGenerator.getOrCreateId(source))
         .addCssClasses(List.of(CoreCSS.EDGE, CoreCSS.EDGE_DASHED))
         .addCssClass(CoreCSS.Marker.TENT.end())
         .sourceId(extendingId)
         .targetId(extendedId)
         .routerKind(GConstants.RouterKind.POLYLINE)
         .add(textEdgeBuilder(
            source,
            "<<extend>>",
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
