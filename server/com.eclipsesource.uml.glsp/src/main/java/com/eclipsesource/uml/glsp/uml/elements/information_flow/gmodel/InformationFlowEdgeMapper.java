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
package com.eclipsesource.uml.glsp.uml.elements.information_flow.gmodel;

import java.util.List;

import org.eclipse.glsp.graph.GEdge;
import org.eclipse.glsp.graph.builder.impl.GEdgeBuilder;
import org.eclipse.glsp.graph.builder.impl.GEdgePlacementBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.InformationFlow;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.core.constants.QuotationMark;
import com.eclipsesource.uml.glsp.uml.gmodel.RepresentationGEdgeMapper;
import com.eclipsesource.uml.glsp.uml.gmodel.element.EdgeGBuilder;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class InformationFlowEdgeMapper extends RepresentationGEdgeMapper<InformationFlow, GEdge>
   implements EdgeGBuilder {

   @Inject
   public InformationFlowEdgeMapper(@Assisted final Representation representation) {
      super(representation);
   }

   @Override
   public GEdge map(final InformationFlow mappingSource) {
      var sourceId = idGenerator.getOrCreateId(mappingSource.getInformationSources().get(0));
      var targetId = idGenerator.getOrCreateId(mappingSource.getInformationTargets().get(0));

      GEdgeBuilder builder = new GEdgeBuilder(configuration().typeId())
         .id(idGenerator.getOrCreateId(mappingSource))
         .addCssClasses(List.of(CoreCSS.EDGE, CoreCSS.EDGE_DASHED))
         .addCssClass(CoreCSS.Marker.TENT.end())
         .sourceId(sourceId)
         .targetId(targetId)
         .routerKind(GConstants.RouterKind.POLYLINE);

      applyEdgeNotation(mappingSource, builder);
      applyName(mappingSource, builder);
      applyTag(mappingSource, builder);

      return builder.build();
   }

   protected void applyName(final InformationFlow source, final GEdgeBuilder builder) {
      builder.add(nameBuilder(source, new GEdgePlacementBuilder()
         .side(GConstants.EdgeSide.BOTTOM)
         .position(0.5d)
         .offset(10d)
         .rotate(true)
         .build()).build());
   }

   protected void applyTag(final InformationFlow source, final GEdgeBuilder builder) {
      builder.add(textEdgeBuilder(
         source,
         QuotationMark.quoteDoubleAngle("flow"),
         new GEdgePlacementBuilder()
            .side(GConstants.EdgeSide.TOP)
            .position(0.5d)
            .offset(10d)
            .rotate(true)
            .build())
               .build());
   }

}
