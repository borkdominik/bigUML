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

import com.eclipsesource.uml.glsp.core.utils.UmlConfig;
import com.eclipsesource.uml.glsp.old.utils.edge.EdgeMultiplicityIdUtil;
import com.eclipsesource.uml.glsp.old.utils.property.PropertyUtil;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.ClassCSS;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.ClassTypes;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGModelMapper;

public class AssociationEdgeMapper extends BaseGModelMapper<Association, GEdge> {

   @Override
   public GEdge map(final Association association) {
      var memberEnds = association.getMemberEnds();
      var source = memberEnds.get(0);
      var target = memberEnds.get(1);

      var builder = new GEdgeBuilder(ClassTypes.ASSOCIATION)
         .id(idGenerator.getOrCreateId(association))
         .addCssClass(UmlConfig.CSS.EDGE)
         .sourceId(idGenerator.getOrCreateId(source.getType()))
         .targetId(idGenerator.getOrCreateId(target.getType()))
         .routerKind(GConstants.RouterKind.MANHATTAN);

      if (association.getKeywords().get(0).equals("composition")) {
         applyComposition(association, builder);
      } else if (association.getKeywords().get(0).equals("aggregation")) {
         applyAggregation(association, builder);
      } else {
         applyAssociation(association, builder);
      }

      return builder.build();
   }

   protected void applyComposition(final Association association, final GEdgeBuilder builder) {
      builder.addCssClass(UmlConfig.CSS.EDGE_DIRECTED_END_TENT);
   }

   protected void applyAggregation(final Association association, final GEdgeBuilder builder) {
      builder.addCssClass(ClassCSS.EDGE_DIAMOND_EMPTY);
   }

   protected void applyAssociation(final Association association, final GEdgeBuilder builder) {
      var memberEnds = association.getMemberEnds();
      var source = memberEnds.get(0);
      var sourceId = idGenerator.getOrCreateId(source);
      var target = memberEnds.get(1);
      var targetId = idGenerator.getOrCreateId(target);

      var sourceNameLabel = createEdgeNameLabel(source.getName(), suffix.labelSuffix.appendTo(sourceId), 0.1d);
      builder.add(sourceNameLabel);

      var sourceMultiplicityLabel = createEdgeMultiplicityLabel(PropertyUtil.getMultiplicity(source),
         EdgeMultiplicityIdUtil.createEdgeLabelMultiplicityId(sourceId), 0.1d);
      builder.add(sourceMultiplicityLabel);

      var targetNameLabel = createEdgeNameLabel(target.getName(), suffix.labelSuffix.appendTo(targetId), 0.9d);
      builder.add(targetNameLabel);

      var targetMultiplicityLabel = createEdgeMultiplicityLabel(PropertyUtil.getMultiplicity(target),
         EdgeMultiplicityIdUtil.createEdgeLabelMultiplicityId(targetId), 0.9d);
      builder.add(targetMultiplicityLabel);
   }

   protected GLabel createEdgeMultiplicityLabel(final String value, final String id, final double position) {
      return createEdgeLabel(value, position, id, ClassTypes.LABEL_EDGE_MULTIPLICITY, GConstants.EdgeSide.BOTTOM);
   }

   protected GLabel createEdgeNameLabel(final String name, final String id, final double position) {
      return createEdgeLabel(name, position, id, UmlConfig.Types.LABEL_EDGE_NAME, GConstants.EdgeSide.TOP);
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
