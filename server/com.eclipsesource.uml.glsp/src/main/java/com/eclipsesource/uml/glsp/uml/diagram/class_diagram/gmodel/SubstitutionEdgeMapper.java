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
import org.eclipse.glsp.graph.builder.impl.GEdgeBuilder;
import org.eclipse.glsp.graph.builder.impl.GEdgePlacementBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.Substitution;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.core.constants.QuotationMark;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.UmlClass_Substitution;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGEdgeMapper;
import com.eclipsesource.uml.glsp.uml.gmodel.element.EdgeGBuilder;

public final class SubstitutionEdgeMapper extends BaseGEdgeMapper<Substitution, GEdge> implements EdgeGBuilder {

   @Override
   public GEdge map(final Substitution source) {
      var substitutingClassifier = source.getSubstitutingClassifier();
      var substitutingClassifierId = idGenerator.getOrCreateId(substitutingClassifier);
      var contract = source.getContract();
      var contractId = idGenerator.getOrCreateId(contract);

      GEdgeBuilder builder = new GEdgeBuilder(UmlClass_Substitution.typeId())
         .id(idGenerator.getOrCreateId(source))
         .addCssClasses(List.of(CoreCSS.EDGE, CoreCSS.EDGE_DASHED))
         .addCssClass(CoreCSS.Marker.TENT.end())
         .sourceId(substitutingClassifierId)
         .targetId(contractId)
         .routerKind(GConstants.RouterKind.POLYLINE)
         .add(textEdgeBuilder(
            source,
            QuotationMark.quoteDoubleAngle("substitution"),
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
