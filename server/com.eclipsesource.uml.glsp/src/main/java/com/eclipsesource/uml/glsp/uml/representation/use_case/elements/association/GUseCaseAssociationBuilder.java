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
package com.eclipsesource.uml.glsp.uml.representation.use_case.elements.association;

import java.util.List;
import java.util.Optional;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GEdge;
import org.eclipse.glsp.graph.builder.impl.GEdgePlacementBuilder;
import org.eclipse.uml2.uml.Actor;
import org.eclipse.uml2.uml.Association;
import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.glsp.sdk.cdk.GModelContext;
import com.eclipsesource.uml.glsp.sdk.cdk.base.GCProvider;
import com.eclipsesource.uml.glsp.sdk.ui.components.label.GCLabel;
import com.eclipsesource.uml.glsp.sdk.ui.components.label.GCNameLabel;
import com.eclipsesource.uml.glsp.uml.elements.association.gmodel.GAssociationBuilder;
import com.eclipsesource.uml.glsp.uml.elements.property.PropertyConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.property.gmodel.suffix.PropertyMultiplicityLabelSuffix;
import com.eclipsesource.uml.glsp.uml.utils.MultiplicityUtil;

public class GUseCaseAssociationBuilder<TOrigin extends Association> extends GAssociationBuilder<TOrigin> {

   public GUseCaseAssociationBuilder(final GModelContext context, final TOrigin origin, final String type) {
      super(context, origin, type);
   }

   @Override
   public EObject source() {
      var first = sourceElement();
      var second = targetElement();

      return first instanceof Actor ? first : second;
   }

   @Override
   public EObject target() {
      var first = sourceElement();
      var second = targetElement();

      return first instanceof Actor ? second : first;
   }

   @Override
   protected List<GCProvider> createMemberEnd(final GEdge edge, final Property memberEnd, final double position,
      final String labelSide, final String multiplicitySide) {

      var memberEndId = context.idGenerator().getOrCreateId(memberEnd);

      var multiplicity = new GCNameLabel.Options(MultiplicityUtil.getMultiplicity(memberEnd));
      multiplicity.id = Optional.of(context.suffix().appendTo(PropertyMultiplicityLabelSuffix.SUFFIX, memberEndId));
      multiplicity.type = context
         .configurationFor(context.representation(), Property.class, PropertyConfiguration.class)
         .multiplicityTypeId();
      multiplicity.edgePlacement = new GEdgePlacementBuilder()
         .side(multiplicitySide)
         .position(position)
         .offset(10d)
         .rotate(true)
         .build();

      return List.of(
         new GCLabel(context, memberEnd, multiplicity));
   }

}
