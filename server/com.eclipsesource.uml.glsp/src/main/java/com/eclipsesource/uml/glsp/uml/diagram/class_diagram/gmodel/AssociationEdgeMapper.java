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
import org.eclipse.glsp.server.emf.EMFIdGenerator;
import org.eclipse.glsp.server.emf.model.notation.Edge;
import org.eclipse.uml2.uml.Association;
import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.glsp.core.gmodel.suffix.Suffix;
import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.eclipsesource.uml.glsp.core.utils.UmlConfig;
import com.eclipsesource.uml.glsp.old.utils.edge.EdgeMultiplicityIdUtil;
import com.eclipsesource.uml.glsp.old.utils.property.PropertyUtil;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.ClassCSS;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.ClassTypes;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGModelMapper;
import com.google.inject.Inject;

public class AssociationEdgeMapper extends BaseGModelMapper<Association, GEdge> {
   @Inject
   protected EMFIdGenerator idGenerator;

   @Inject
   private UmlModelState modelState;

   @Inject
   private Suffix suffix;

   @Override
   public GEdge map(final Association association) {
      EList<Property> memberEnds = association.getMemberEnds();
      Property source = memberEnds.get(0);
      String sourceId = idGenerator.getOrCreateId(source);
      Property target = memberEnds.get(1);
      String targetId = idGenerator.getOrCreateId(target);

      if (association.getKeywords().get(0).equals("composition")) {
         GEdgeBuilder builder = new GEdgeBuilder(ClassTypes.COMPOSITION)
            .id(idGenerator.getOrCreateId(association))
            .addCssClass(UmlConfig.CSS.EDGE)
            .addCssClass(UmlConfig.CSS.EDGE_DIRECTED_END_TENT)
            .sourceId(idGenerator.getOrCreateId(source.getType()))
            .targetId(idGenerator.getOrCreateId(target.getType()))
            .routerKind(GConstants.RouterKind.MANHATTAN);

         modelState.getIndex().getNotation(association, Edge.class).ifPresent(edge -> {
            if (edge.getBendPoints() != null) {
               ArrayList<GPoint> bendPoints = new ArrayList<>();
               edge.getBendPoints().forEach(p -> bendPoints.add(GraphUtil.copy(p)));
               builder.addRoutingPoints(bendPoints);
            }
         });
         return builder.build();
      } else if (association.getKeywords().get(0).equals("aggregation")) {

         GEdgeBuilder builder = new GEdgeBuilder(ClassTypes.COMPOSITION)
            .id(idGenerator.getOrCreateId(association))
            .addCssClass(UmlConfig.CSS.EDGE)
            .addCssClass(ClassCSS.EDGE_DIAMOND_EMPTY)
            .sourceId(idGenerator.getOrCreateId(source.getType()))
            .targetId(idGenerator.getOrCreateId(target.getType()))
            .routerKind(GConstants.RouterKind.MANHATTAN);

         modelState.getIndex().getNotation(association, Edge.class).ifPresent(edge -> {
            if (edge.getBendPoints() != null) {
               ArrayList<GPoint> bendPoints = new ArrayList<>();
               edge.getBendPoints().forEach(p -> bendPoints.add(GraphUtil.copy(p)));
               builder.addRoutingPoints(bendPoints);
            }
         });
         return builder.build();
      } else {
         GEdgeBuilder builder = new GEdgeBuilder(ClassTypes.ASSOCIATION)
            .id(idGenerator.getOrCreateId(association))
            .addCssClass(UmlConfig.CSS.EDGE)
            .sourceId(idGenerator.getOrCreateId(source.getType()))
            .targetId(idGenerator.getOrCreateId(target.getType()))
            .routerKind(GConstants.RouterKind.MANHATTAN);

         GLabel sourceNameLabel = createEdgeNameLabel(source.getName(), suffix.labelSuffix.appendTo(sourceId), 0.1d);
         builder.add(sourceNameLabel);

         GLabel sourceMultiplicityLabel = createEdgeMultiplicityLabel(PropertyUtil.getMultiplicity(source),
            EdgeMultiplicityIdUtil.createEdgeLabelMultiplicityId(sourceId), 0.1d);
         builder.add(sourceMultiplicityLabel);

         GLabel targetNameLabel = createEdgeNameLabel(target.getName(), suffix.labelSuffix.appendTo(targetId), 0.9d);
         builder.add(targetNameLabel);

         GLabel targetMultiplicityLabel = createEdgeMultiplicityLabel(PropertyUtil.getMultiplicity(target),
            EdgeMultiplicityIdUtil.createEdgeLabelMultiplicityId(targetId), 0.9d);
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
