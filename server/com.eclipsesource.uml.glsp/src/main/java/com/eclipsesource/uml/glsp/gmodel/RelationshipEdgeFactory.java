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
package com.eclipsesource.uml.glsp.gmodel;

import java.util.ArrayList;

import org.eclipse.emf.common.util.EList;
import org.eclipse.glsp.graph.GEdge;
import org.eclipse.glsp.graph.GLabel;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.builder.impl.GEdgeBuilder;
import org.eclipse.glsp.graph.builder.impl.GEdgePlacementBuilder;
import org.eclipse.glsp.graph.builder.impl.GLabelBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.uml2.uml.Association;
import org.eclipse.uml2.uml.Property;
import org.eclipse.uml2.uml.Relationship;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.util.UmlConfig.CSS;
import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.eclipsesource.uml.glsp.util.UmlIDUtil;
import com.eclipsesource.uml.glsp.util.UmlLabelUtil;
import com.eclipsesource.uml.modelserver.unotation.Edge;

public class RelationshipEdgeFactory extends AbstractGModelFactory<Relationship, GEdge> {

   public RelationshipEdgeFactory(final UmlModelState modelState) {
      super(modelState);
   }

   @Override
   public GEdge create(final Relationship element) {
      if (element instanceof Association) {
         return createAssociationEdge((Association) element);
      }
      return null;
   }

   protected GEdge createAssociationEdge(final Association association) {
      EList<Property> memberEnds = association.getMemberEnds();
      Property source = memberEnds.get(0);
      String sourceId = toId(source);
      Property target = memberEnds.get(1);
      String targetId = toId(target);

      GEdgeBuilder builder = new GEdgeBuilder(Types.ASSOCIATION)
         .id(toId(association))
         .addCssClass(CSS.EDGE)
         .sourceId(toId(source.getType()))
         .targetId(toId(target.getType()))
         .routerKind(GConstants.RouterKind.MANHATTAN);

      GLabel sourceNameLabel = createEdgeNameLabel(source.getName(), UmlIDUtil.createLabelNameId(sourceId), 0.1d);
      builder.add(sourceNameLabel);

      GLabel sourceMultiplicityLabel = createEdgeMultiplicityLabel(UmlLabelUtil.getMultiplicity(source),
         UmlIDUtil.createLabelMultiplicityId(sourceId), 0.1d);
      builder.add(sourceMultiplicityLabel);

      GLabel targetNameLabel = createEdgeNameLabel(target.getName(), UmlIDUtil.createLabelNameId(targetId), 0.9d);
      builder.add(targetNameLabel);

      GLabel targetMultiplicityLabel = createEdgeMultiplicityLabel(UmlLabelUtil.getMultiplicity(target),
         UmlIDUtil.createLabelMultiplicityId(targetId), 0.9d);
      builder.add(targetMultiplicityLabel);

      modelState.getIndex().getNotation(association, Edge.class).ifPresent(edge -> {
         if (edge.getBendPoints() != null) {
            ArrayList<GPoint> bendPoints = new ArrayList<>();
            edge.getBendPoints().forEach(p -> bendPoints.add(GraphUtil.copy(p)));
            builder.addRoutingPoints(bendPoints);
         }
      });
      return builder.build();
   }

   protected GLabel createEdgeMultiplicityLabel(final String value, final String id, final double position) {
      return createEdgeLabel(value, position, id, Types.LABEL_EDGE_MULTIPLICITY, GConstants.EdgeSide.BOTTOM);
   }

   protected GLabel createEdgeNameLabel(final String name, final String id, final double position) {
      return createEdgeLabel(name, position, id, Types.LABEL_EDGE_NAME, GConstants.EdgeSide.TOP);
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
