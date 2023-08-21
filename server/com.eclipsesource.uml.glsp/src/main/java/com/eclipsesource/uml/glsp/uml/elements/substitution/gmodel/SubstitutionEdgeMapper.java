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
package com.eclipsesource.uml.glsp.uml.elements.substitution.gmodel;

import java.util.List;

import org.eclipse.glsp.graph.GEdge;
import org.eclipse.glsp.graph.builder.impl.GArguments;
import org.eclipse.glsp.graph.builder.impl.GEdgeBuilder;
import org.eclipse.glsp.graph.builder.impl.GEdgePlacementBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.Substitution;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.core.constants.QuotationMark;
import com.eclipsesource.uml.glsp.uml.gmodel.RepresentationGEdgeMapper;
import com.eclipsesource.uml.glsp.uml.gmodel.element.EdgeGBuilder;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public final class SubstitutionEdgeMapper extends RepresentationGEdgeMapper<Substitution, GEdge>
   implements EdgeGBuilder {

   @Inject
   public SubstitutionEdgeMapper(@Assisted final Representation representation) {
      super(representation);
   }

   @Override
   public GEdge map(final Substitution source) {
      var substitutingClassifier = source.getSubstitutingClassifier();
      var substitutingClassifierId = idGenerator.getOrCreateId(substitutingClassifier);
      var contract = source.getContract();
      var contractId = idGenerator.getOrCreateId(contract);

      GEdgeBuilder builder = new GEdgeBuilder(configuration().typeId())
         .id(idGenerator.getOrCreateId(source))
         .addCssClasses(List.of(CoreCSS.EDGE, CoreCSS.EDGE_DASHED))
         .addCssClass(CoreCSS.Marker.TENT.end())
         .sourceId(substitutingClassifierId)
         .targetId(contractId)
         .routerKind(GConstants.RouterKind.POLYLINE)
         .addArgument(GArguments.edgePadding(10))
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
