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
package com.eclipsesource.uml.glsp.uml.elements.association.gmodel;

import org.eclipse.glsp.graph.GEdge;
import org.eclipse.glsp.graph.builder.impl.GEdgeBuilder;
import org.eclipse.glsp.graph.builder.impl.GEdgePlacementBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.Association;
import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.suffix.PropertyMultiplicityLabelSuffix;
import com.eclipsesource.uml.glsp.uml.elements.association.AssociationConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.property.PropertyConfiguration;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGEdgeMapper;
import com.eclipsesource.uml.glsp.uml.gmodel.element.EdgeGBuilder;
import com.eclipsesource.uml.glsp.uml.utils.MultiplicityUtil;

public class AssociationEdgeMapper extends BaseGEdgeMapper<Association, GEdge> implements EdgeGBuilder {

   @Override
   public GEdge map(final Association source) {
      var builder = new GEdgeBuilder(AssociationConfiguration.typeId())
         .id(idGenerator.getOrCreateId(source))
         .addCssClass(CoreCSS.EDGE)
         .routerKind(GConstants.RouterKind.POLYLINE);

      applyMemberEnds(source, builder);
      applyEdgeNotation(source, builder);

      return builder.build();
   }

   protected void applyMemberEnds(final Association source, final GEdgeBuilder builder) {
      var memberEnds = source.getMemberEnds();
      var memberEndFirst = memberEnds.get(0);
      var memberEndSecond = memberEnds.get(1);

      builder
         .sourceId(idGenerator.getOrCreateId(memberEndFirst.getType()))
         .targetId(idGenerator.getOrCreateId(memberEndSecond.getType()));

      applyMemberEnd(memberEndFirst, builder, 0.9d);
      applyMemberEnd(memberEndSecond, builder, 0.1d);
   }

   protected void applyMemberEnd(final Property memberEnd, final GEdgeBuilder builder, final double position) {
      var memberEndId = idGenerator.getOrCreateId(memberEnd);

      builder.add(
         textEdgeBuilder(
            PropertyConfiguration.Label.multiplicityTypeId(),
            suffix.appendTo(PropertyMultiplicityLabelSuffix.SUFFIX, memberEndId),
            MultiplicityUtil.getMultiplicity(memberEnd),
            new GEdgePlacementBuilder()
               .side(GConstants.EdgeSide.TOP)
               .position(position)
               .offset(10d)
               .rotate(false)
               .build()).build());
   }
}
