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
import org.eclipse.uml2.uml.Association;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.core.constants.CoreTypes;
import com.eclipsesource.uml.glsp.core.gmodel.suffix.LabelSuffix;
import com.eclipsesource.uml.glsp.old.utils.property.PropertyUtil;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.ClassTypes;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.suffix.PropertyLabelMultiplicitySuffix;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.utils.AssociationTypeUtil;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGEdgeMapper;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.constants.AssociationType;

public class AssociationEdgeMapper extends BaseGEdgeMapper<Association, GEdge> {

   @Override
   public GEdge map(final Association association) {
      var memberEnds = association.getMemberEnds();
      var source = memberEnds.get(0);
      var target = memberEnds.get(1);
      var associationType = AssociationType.from(target.getAggregation());

      var builder = new GEdgeBuilder(AssociationTypeUtil.toClassType(associationType))
         .id(idGenerator.getOrCreateId(association))
         .addCssClass(CoreCSS.EDGE)
         .sourceId(idGenerator.getOrCreateId(source.getOwner()))
         .targetId(idGenerator.getOrCreateId(target.getOwner()))
         .routerKind(GConstants.RouterKind.MANHATTAN);

      if (associationType == AssociationType.COMPOSITION) {
         applyComposition(association, builder);
      } else if (associationType == AssociationType.AGGREGATION) {
         applyAggregation(association, builder);
      } else {
         applyAssociation(association, builder);
      }

      applyEdgeNotation(association, builder);

      return builder.build();
   }

   protected void applyComposition(final Association association, final GEdgeBuilder builder) {
      builder.addCssClass(CoreCSS.MARKER_DIAMOND)
         .addCssClass(CoreCSS.MARKER_START);
   }

   protected void applyAggregation(final Association association, final GEdgeBuilder builder) {
      builder.addCssClass(CoreCSS.MARKER_DIAMOND_EMPTY)
         .addCssClass(CoreCSS.MARKER_START);
   }

   protected void applyAssociation(final Association association, final GEdgeBuilder builder) {
      var memberEnds = association.getMemberEnds();
      var source = memberEnds.get(0);
      var sourceId = idGenerator.getOrCreateId(source);
      var target = memberEnds.get(1);
      var targetId = idGenerator.getOrCreateId(target);

      // Label at source
      var sourceNameLabel = createEdgeNameLabel(target.getName(), suffix.appendTo(LabelSuffix.SUFFIX, targetId), 0.1d);
      builder.add(sourceNameLabel);

      var sourceMultiplicityLabel = createEdgeMultiplicityLabel(PropertyUtil.getMultiplicity(target),
         suffix.appendTo(PropertyLabelMultiplicitySuffix.SUFFIX, targetId), 0.1d);
      builder.add(sourceMultiplicityLabel);

      // Label at target
      var targetNameLabel = createEdgeNameLabel(source.getName(), suffix.appendTo(LabelSuffix.SUFFIX, sourceId), 0.9d);
      builder.add(targetNameLabel);

      var targetMultiplicityLabel = createEdgeMultiplicityLabel(PropertyUtil.getMultiplicity(source),
         suffix.appendTo(PropertyLabelMultiplicitySuffix.SUFFIX, sourceId), 0.9d);
      builder.add(targetMultiplicityLabel);
   }

   protected GLabel createEdgeMultiplicityLabel(final String value, final String id, final double position) {
      return createEdgeLabel(value, position, id, ClassTypes.LABEL_EDGE_MULTIPLICITY, GConstants.EdgeSide.BOTTOM);
   }

   protected GLabel createEdgeNameLabel(final String name, final String id, final double position) {
      return createEdgeLabel(name, position, id, CoreTypes.LABEL_EDGE_NAME, GConstants.EdgeSide.TOP);
   }

   protected GLabel createEdgeLabel(final String name, final double position, final String id, final String type,
      final String side) {
      return new GLabelBuilder(type)
         .edgePlacement(new GEdgePlacementBuilder()
            .side(side)
            .position(position)
            .offset(2d)
            .rotate(false)
            .build())
         .id(id)
         .text(name).build();
   }
}
