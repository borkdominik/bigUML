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
package com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel;

import java.util.List;

import org.eclipse.glsp.graph.GEdge;
import org.eclipse.glsp.graph.builder.impl.GArguments;
import org.eclipse.glsp.graph.builder.impl.GEdgeBuilder;
import org.eclipse.glsp.graph.builder.impl.GEdgePlacementBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.Abstraction;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.core.constants.QuotationMark;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.UmlClass_Abstraction;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGEdgeMapper;
import com.eclipsesource.uml.glsp.uml.gmodel.element.EdgeGBuilder;

public final class AbstractionEdgeMapper extends BaseGEdgeMapper<Abstraction, GEdge> implements EdgeGBuilder {

   @Override
   public GEdge map(final Abstraction source) {
      var client = source.getClients().get(0);
      var clientId = idGenerator.getOrCreateId(client);
      var supplier = source.getSuppliers().get(0);
      var supplierId = idGenerator.getOrCreateId(supplier);

      GEdgeBuilder builder = new GEdgeBuilder(UmlClass_Abstraction.typeId())
         .id(idGenerator.getOrCreateId(source))
         .addCssClasses(List.of(CoreCSS.EDGE, CoreCSS.EDGE_DASHED))
         .addCssClass(CoreCSS.Marker.TENT.end())
         .sourceId(clientId)
         .targetId(supplierId)
         .routerKind(GConstants.RouterKind.POLYLINE)
         .addArgument(GArguments.edgePadding(10))
         .add(textEdgeBuilder(
            source,
            QuotationMark.quoteDoubleAngle("abstraction"),
            new GEdgePlacementBuilder()
               .side(GConstants.EdgeSide.TOP)
               .position(0.5d)
               .offset(10d)
               .rotate(true)
               .build())
                  .build());

      applyEdgeNotation(source, builder);

      return builder.build();
   }
}
