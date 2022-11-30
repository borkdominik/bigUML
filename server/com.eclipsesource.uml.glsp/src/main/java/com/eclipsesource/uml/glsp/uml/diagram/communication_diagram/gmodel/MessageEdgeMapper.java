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
package com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.gmodel;

import java.util.ArrayList;

import org.eclipse.glsp.graph.GEdge;
import org.eclipse.glsp.graph.GLabel;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.builder.impl.GEdgeBuilder;
import org.eclipse.glsp.graph.builder.impl.GEdgePlacementBuilder;
import org.eclipse.glsp.graph.builder.impl.GLabelBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.emf.model.notation.Edge;
import org.eclipse.uml2.uml.Message;
import org.eclipse.uml2.uml.MessageOccurrenceSpecification;

import com.eclipsesource.uml.glsp.core.utils.UmlConfig;
import com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.constants.CommunicationTypes;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGModelMapper;

public class MessageEdgeMapper extends BaseGModelMapper<Message, GEdge> {

   @Override
   public GEdge map(final Message message) {
      var sendEvent = (MessageOccurrenceSpecification) message.getSendEvent();
      var receiveEvent = (MessageOccurrenceSpecification) message.getReceiveEvent();

      var source = sendEvent.getCovered();
      var target = receiveEvent.getCovered();

      var builder = new GEdgeBuilder(CommunicationTypes.MESSAGE)
         .id(idGenerator.getOrCreateId(message))
         .addCssClass(UmlConfig.CSS.EDGE)
         .sourceId(idGenerator.getOrCreateId(source))
         .targetId(idGenerator.getOrCreateId(target))
         .routerKind(GConstants.RouterKind.MANHATTAN);

      var nameLabel = createEdgeNameLabel(message.getName(),
         suffix.labelSuffix.appendTo(idGenerator.getOrCreateId(message)), 0.6d);
      builder.add(nameLabel);

      modelState.getIndex().getNotation(message, Edge.class).ifPresent(edge -> {
         if (edge.getBendPoints() != null) {
            ArrayList<GPoint> bendPoints = new ArrayList<>();
            edge.getBendPoints().forEach(p -> bendPoints.add(GraphUtil.copy(p)));
            builder.addRoutingPoints(bendPoints);
         }
      });
      return builder.build();
   }

   protected GLabel createEdgeNameLabel(final String name, final String id, final double position) {
      return createEdgeLabel(name, position, id, CommunicationTypes.MESSAGE_LABEL_ARROW_EDGE_NAME,
         GConstants.EdgeSide.TOP);
   }

   protected GLabel createEdgeLabel(final String name, final double position, final String id, final String type,
      final String side) {
      return new GLabelBuilder(type)
         .edgePlacement(new GEdgePlacementBuilder()
            .side(side)
            .position(position)
            .rotate(false)
            .build())
         .id(id)
         .text(name).build();
   }
}
