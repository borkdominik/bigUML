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

import org.eclipse.glsp.graph.GEdge;
import org.eclipse.glsp.graph.GLabel;
import org.eclipse.glsp.graph.builder.impl.GEdgeBuilder;
import org.eclipse.glsp.graph.builder.impl.GEdgePlacementBuilder;
import org.eclipse.glsp.graph.builder.impl.GLabelBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.AggregationKind;
import org.eclipse.uml2.uml.Association;
import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.core.constants.CoreTypes;
import com.eclipsesource.uml.glsp.core.gmodel.suffix.NameLabelSuffix;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_Association;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_Property;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.suffix.PropertyMultiplicityLabelSuffix;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.utils.PropertyUtil;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGEdgeMapper;

public final class AssociationEdgeMapper extends BaseGEdgeMapper<Association, GEdge> {

   @Override
   public GEdge map(final Association source) {
      var builder = new GEdgeBuilder(UmlClass_Association.TYPE_ID)
         .id(idGenerator.getOrCreateId(source))
         .addCssClass(CoreCSS.EDGE)
         .routerKind(GConstants.RouterKind.MANHATTAN);

      applyMemberEnds(source, builder);
      applyEdgeNotation(source, builder);

      return builder.build();
   }

   protected void applyMemberEnds(final Association source, final GEdgeBuilder builder) {
      var memberEnds = source.getMemberEnds();
      var memberEndFirst = memberEnds.get(0);
      var memberEndSecond = memberEnds.get(1);

      builder
         .sourceId(idGenerator.getOrCreateId(memberEndFirst.getOwner()))
         .targetId(idGenerator.getOrCreateId(memberEndSecond.getOwner()));

      applyMemberEnd(memberEndFirst, builder, 0.9d);
      applyMemberEnd(memberEndSecond, builder, 0.1d);
   }

   protected void applyMemberEnd(final Property memberEnd, final GEdgeBuilder builder, final double position) {
      var memberEndId = idGenerator.getOrCreateId(memberEnd);

      var nameLabel = createEdgeNameLabel(memberEnd.getName(),
         suffix.appendTo(NameLabelSuffix.SUFFIX, memberEndId),
         position);
      builder.add(nameLabel);

      var multiplicityLabel = createEdgeMultiplicityLabel(PropertyUtil.getMultiplicity(memberEnd),
         suffix.appendTo(PropertyMultiplicityLabelSuffix.SUFFIX, memberEndId), position);
      builder.add(multiplicityLabel);

      var marker = marker(memberEnd.getAggregation());
      builder.addCssClass(position < 0.5d ? marker.start() : marker.end());
   }

   protected CoreCSS.Marker marker(final AggregationKind aggregationKind) {
      switch (aggregationKind) {
         case COMPOSITE_LITERAL:
            return CoreCSS.Marker.DIAMOND;
         case SHARED_LITERAL:
            return CoreCSS.Marker.DIAMOND_EMPTY;
         default:
            return CoreCSS.Marker.NONE;
      }
   }

   protected GLabel createEdgeMultiplicityLabel(final String value, final String id, final double position) {
      return createEdgeLabel(value, position, id, UmlClass_Property.LABEL_MULTIPLICITY, GConstants.EdgeSide.BOTTOM,
         10d);
   }

   protected GLabel createEdgeNameLabel(final String name, final String id, final double position) {
      return createEdgeLabel(name, position, id, CoreTypes.LABEL_NAME, GConstants.EdgeSide.TOP, 2d);
   }

   protected GLabel createEdgeLabel(final String name, final double position, final String id, final String type,
      final String side, final double offset) {
      return new GLabelBuilder(type)
         .edgePlacement(new GEdgePlacementBuilder()
            .side(side)
            .position(position)
            .offset(offset)
            .rotate(false)
            .build())
         .id(id)
         .text(name).build();
   }
}
