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
package com.eclipsesource.uml.glsp.uml.elements.association.gmodel;

import org.eclipse.glsp.graph.GEdge;
import org.eclipse.glsp.graph.builder.impl.GArguments;
import org.eclipse.glsp.graph.builder.impl.GEdgeBuilder;
import org.eclipse.glsp.graph.builder.impl.GEdgePlacementBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.Association;
import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.uml.elements.association.AssociationConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.property.PropertyConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.property.gmodel.suffix.PropertyMultiplicityLabelSuffix;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGEdgeMapper;
import com.eclipsesource.uml.glsp.uml.gmodel.element.EdgeGBuilder;
import com.eclipsesource.uml.glsp.uml.utils.MultiplicityUtil;

public final class AssociationEdgeMapper extends BaseGEdgeMapper<Association, GEdge> implements EdgeGBuilder {

   @Override
   public GEdge map(final Association source) {
      var builder = new GEdgeBuilder(AssociationConfiguration.typeId())
         .id(idGenerator.getOrCreateId(source))
         .addCssClass(CoreCSS.EDGE)
         .routerKind(GConstants.RouterKind.POLYLINE)
         .addArgument(GArguments.edgePadding(10));

      applyName(source, builder);
      applyMemberEnds(source, builder);
      applyEdgeNotation(source, builder);

      return builder.build();
   }

   protected void applyName(final Association source, final GEdgeBuilder builder) {
      if (source.getName() != null && !source.getName().isBlank()) {
         builder.add(textEdgeBuilder(
            source,
            source.getName(),
            new GEdgePlacementBuilder()
               .side(GConstants.EdgeSide.TOP)
               .position(0.5d)
               .offset(10d)
               .rotate(true)
               .build()).build());
      }
   }

   protected void applyMemberEnds(final Association source, final GEdgeBuilder builder) {
      var memberEnds = source.getMemberEnds();
      var memberEndFirst = memberEnds.get(0);
      var memberEndSecond = memberEnds.get(1);

      builder
         .sourceId(idGenerator.getOrCreateId(memberEndFirst.getOwner()))
         .targetId(idGenerator.getOrCreateId(memberEndSecond.getOwner()));

      applyMemberEnd(memberEndFirst, builder, 0.9d, GConstants.EdgeSide.BOTTOM, GConstants.EdgeSide.TOP);
      applyMemberEnd(memberEndSecond, builder, 0.1d, GConstants.EdgeSide.TOP, GConstants.EdgeSide.BOTTOM);
   }

   protected void applyMemberEnd(final Property memberEnd, final GEdgeBuilder builder, final double position,
      final String labelSide, final String multiplicitySide) {
      var memberEndId = idGenerator.getOrCreateId(memberEnd);

      builder.add(nameBuilder(memberEnd,
         new GEdgePlacementBuilder()
            .side(labelSide)
            .position(position)
            .rotate(true)
            .offset(10d)
            .build())
               .build());

      builder.add(
         textEdgeBuilder(
            PropertyConfiguration.Label.multiplicityTypeId(),
            suffix.appendTo(PropertyMultiplicityLabelSuffix.SUFFIX, memberEndId),
            MultiplicityUtil.getMultiplicity(memberEnd),
            new GEdgePlacementBuilder()
               .side(multiplicitySide)
               .position(position)
               .offset(10d)
               .rotate(true)
               .build())
                  .build());

      var marker = CoreCSS.Marker.from(memberEnd.getAggregation());
      builder.addCssClass(position < 0.5d ? marker.start() : marker.end());
   }
}
