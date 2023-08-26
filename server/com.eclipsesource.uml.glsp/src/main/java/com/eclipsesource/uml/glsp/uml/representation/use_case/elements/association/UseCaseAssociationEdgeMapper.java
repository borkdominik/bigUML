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
package com.eclipsesource.uml.glsp.uml.representation.use_case.elements.association;

import org.eclipse.glsp.graph.GEdge;
import org.eclipse.glsp.graph.builder.impl.GArguments;
import org.eclipse.glsp.graph.builder.impl.GEdgeBuilder;
import org.eclipse.glsp.graph.builder.impl.GEdgePlacementBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.Actor;
import org.eclipse.uml2.uml.Association;
import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.uml.elements.association.gmodel.AssociationEdgeMapper;
import com.eclipsesource.uml.glsp.uml.elements.property.PropertyConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.property.gmodel.suffix.PropertyMultiplicityLabelSuffix;
import com.eclipsesource.uml.glsp.uml.utils.MultiplicityUtil;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public final class UseCaseAssociationEdgeMapper extends AssociationEdgeMapper {

   @Inject
   public UseCaseAssociationEdgeMapper(@Assisted final Representation representation) {
      super(representation);
   }

   @Override
   public GEdge map(final Association source) {
      var builder = new GEdgeBuilder(configuration().typeId())
         .id(idGenerator.getOrCreateId(source))
         .addCssClass(CoreCSS.EDGE)
         .routerKind(GConstants.RouterKind.POLYLINE)
         .addArgument(GArguments.edgePadding(10));

      applyName(source, builder);
      applyMemberEnds(source, builder);
      applyEdgeNotation(source, builder);

      return builder.build();
   }

   @Override
   protected void applyMemberEnds(final Association source, final GEdgeBuilder builder) {
      var memberEnds = source.getMemberEnds();
      var memberEndFirst = memberEnds.get(0);
      var memberEndSecond = memberEnds.get(1);

      var first = memberEndFirst.getOwner() instanceof Association ? memberEndFirst.getType()
         : memberEndFirst.getOwner();
      var second = memberEndSecond.getOwner() instanceof Association ? memberEndSecond.getType()
         : memberEndSecond.getOwner();

      var memberSource = first instanceof Actor ? first : second;
      var memberTarget = first instanceof Actor ? second : first;

      builder
         .sourceId(idGenerator.getOrCreateId(memberSource))
         .targetId(idGenerator.getOrCreateId(memberTarget));

      applyMemberEnd(memberEndFirst, builder, 0.9d, GConstants.EdgeSide.BOTTOM, GConstants.EdgeSide.TOP);
      applyMemberEnd(memberEndSecond, builder, 0.1d, GConstants.EdgeSide.TOP, GConstants.EdgeSide.BOTTOM);
   }

   @Override
   protected void applyMemberEnd(final Property memberEnd, final GEdgeBuilder builder, final double position,
      final String labelSide, final String multiplicitySide) {
      var memberEndId = idGenerator.getOrCreateId(memberEnd);

      builder.add(
         textEdgeBuilder(
            configurationFor(Property.class, PropertyConfiguration.class).multiplicityTypeId(),
            suffix.appendTo(PropertyMultiplicityLabelSuffix.SUFFIX, memberEndId),
            MultiplicityUtil.getMultiplicity(memberEnd),
            new GEdgePlacementBuilder()
               .side(multiplicitySide)
               .position(position)
               .offset(10d)
               .rotate(true)
               .build())
                  .build());
   }
}
