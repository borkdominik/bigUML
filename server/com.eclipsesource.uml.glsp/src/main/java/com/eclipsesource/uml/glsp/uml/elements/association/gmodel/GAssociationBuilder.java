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

import java.util.List;
import java.util.Optional;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GEdge;
import org.eclipse.glsp.graph.builder.impl.GEdgePlacementBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.Association;
import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.sdk.cdk.GModelContext;
import com.eclipsesource.uml.glsp.sdk.cdk.base.GCProvider;
import com.eclipsesource.uml.glsp.sdk.cdk.gmodel.GCModelList;
import com.eclipsesource.uml.glsp.sdk.cdk.utils.GCNone;
import com.eclipsesource.uml.glsp.sdk.ui.builder.GCEdgeBuilder;
import com.eclipsesource.uml.glsp.sdk.ui.components.label.GCLabel;
import com.eclipsesource.uml.glsp.sdk.ui.components.label.GCNameLabel;
import com.eclipsesource.uml.glsp.sdk.utils.StreamUtils;
import com.eclipsesource.uml.glsp.uml.elements.property.PropertyConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.property.gmodel.suffix.PropertyMultiplicityLabelSuffix;
import com.eclipsesource.uml.glsp.uml.utils.MultiplicityUtil;

public class GAssociationBuilder<TOrigin extends Association> extends GCEdgeBuilder<TOrigin> {

   public GAssociationBuilder(final GModelContext context, final TOrigin origin, final String type) {
      super(context, origin, type);
   }

   @Override
   public EObject source() {
      var source = sourceProperty();
      return source.getOwner() instanceof Association ? source.getType()
         : source.getOwner();
   }

   public Property sourceProperty() {
      var memberEnds = origin.getMemberEnds();
      return memberEnds.get(0);
   }

   @Override
   public EObject target() {
      var target = targetProperty();
      return target.getOwner() instanceof Association ? target.getType()
         : target.getOwner();
   }

   public Property targetProperty() {
      var memberEnds = origin.getMemberEnds();
      return memberEnds.get(1);

   }

   @Override
   protected List<GCProvider> createComponentChildren(final GEdge gmodelRoot, final GCModelList<?, ?> componentRoot) {
      var source = sourceProperty();
      var target = targetProperty();

      return StreamUtils.concat(
         List.of(createName(componentRoot)),
         createMemberEnd(gmodelRoot, source, 0.9d, GConstants.EdgeSide.BOTTOM, GConstants.EdgeSide.TOP),
         createMemberEnd(gmodelRoot, target, 0.1d, GConstants.EdgeSide.TOP, GConstants.EdgeSide.BOTTOM));
   }

   protected GCProvider createName(final GCModelList<?, ?> root) {
      if (origin.getName() != null && !origin.getName().isBlank()) {
         var options = new GCNameLabel.Options(origin.getName());
         var edgePlacement = new GEdgePlacementBuilder()
            .side(GConstants.EdgeSide.TOP)
            .position(0.5d)
            .offset(10d)
            .rotate(true)
            .build();

         options.edgePlacement = edgePlacement;

         return new GCNameLabel(context, origin, options);
      }

      return new GCNone(context, origin);
   }

   protected List<GCProvider> createMemberEnd(final GEdge edge, final Property memberEnd, final double position,
      final String labelSide, final String multiplicitySide) {

      var memberEndId = context.idGenerator().getOrCreateId(memberEnd);

      var lo1 = new GCNameLabel.Options(memberEnd.getName());
      lo1.edgePlacement = new GEdgePlacementBuilder()
         .side(labelSide)
         .position(position)
         .rotate(true)
         .offset(10d)
         .build();

      var lo2 = new GCNameLabel.Options(MultiplicityUtil.getMultiplicity(memberEnd));
      lo2.id = Optional.of(context.suffix().appendTo(PropertyMultiplicityLabelSuffix.SUFFIX, memberEndId));
      lo2.type = context.configurationFor(context.representation(), Property.class, PropertyConfiguration.class)
         .multiplicityTypeId();
      lo2.edgePlacement = new GEdgePlacementBuilder()
         .side(multiplicitySide)
         .position(position)
         .offset(10d)
         .rotate(true)
         .build();

      var marker = CoreCSS.Marker.from(memberEnd.getAggregation());
      edge.getCssClasses().add(position < 0.5d ? marker.start() : marker.end());

      return List.of(
         new GCNameLabel(context, memberEnd, lo1),
         new GCLabel(context, memberEnd, lo2));
   }

}
