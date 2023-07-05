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
package com.eclipsesource.uml.glsp.uml.diagram.package_diagram.gmodel;

import java.util.List;

import org.eclipse.glsp.graph.GEdge;
import org.eclipse.glsp.graph.builder.impl.GEdgeBuilder;
import org.eclipse.glsp.graph.builder.impl.GEdgePlacementBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.Dependency;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.diagram.UmlPackage_Dependency;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGEdgeMapper;
import com.eclipsesource.uml.glsp.uml.gmodel.element.EdgeGBuilder;

public final class DependencyEdgeMapper extends BaseGEdgeMapper<Dependency, GEdge> implements EdgeGBuilder {

   @Override
   public GEdge map(final Dependency source) {
      var client = source.getClients().get(0);
      var clientId = idGenerator.getOrCreateId(client);
      var supplier = source.getSuppliers().get(0);
      var supplierId = idGenerator.getOrCreateId(supplier);

      GEdgeBuilder builder = new GEdgeBuilder(UmlPackage_Dependency.typeId())
         .id(idGenerator.getOrCreateId(source))
         .addCssClasses(List.of(CoreCSS.EDGE, CoreCSS.EDGE_DASHED))
         .addCssClass(CoreCSS.Marker.TENT.end())
         .sourceId(clientId)
         .targetId(supplierId)
         .routerKind(GConstants.RouterKind.MANHATTAN)
         .add(textEdgeBuilder(
            source,
            "<<use>>",
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
