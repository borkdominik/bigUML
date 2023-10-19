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
package com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.gmodel;

import java.util.ArrayList;
import java.util.List;

import org.eclipse.glsp.graph.GEdge;
import org.eclipse.glsp.graph.GLabel;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.builder.impl.GEdgeBuilder;
import org.eclipse.glsp.graph.builder.impl.GEdgePlacementBuilder;
import org.eclipse.glsp.graph.builder.impl.GLabelBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.emf.model.notation.Edge;
import org.eclipse.glsp.server.emf.model.notation.Shape;
import org.eclipse.uml2.uml.Message;
import org.eclipse.uml2.uml.MessageEnd;
import org.eclipse.uml2.uml.MessageSort;
import org.eclipse.uml2.uml.NamedElement;
import org.eclipse.uml2.uml.OccurrenceSpecification;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.core.constants.CoreTypes;
import com.eclipsesource.uml.glsp.core.gmodel.suffix.NameLabelSuffix;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.diagram.UmlSequence_Message;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGEdgeMapper;
import com.eclipsesource.uml.glsp.uml.gmodel.element.EdgeGBuilder;
import com.eclipsesource.uml.modelserver.model.ModelFactory;

public class MessageEdgeMapper extends BaseGEdgeMapper<Message, GEdge> implements EdgeGBuilder {

   double messageOccurrenceNodeDiameter = 10;

   @Override
   public GEdge map(final Message message) {

      var builder = new GEdgeBuilder(UmlSequence_Message.typeId())
         .id(idGenerator.getOrCreateId(message))
         .sourceId(getMessageEndId(message, message.getSendEvent()))
         .targetId(getMessageEndId(message, message.getReceiveEvent()))
         .routerKind(GConstants.RouterKind.POLYLINE);

      builder.addCssClasses(edgeStyler(message, builder));

      GLabel nameLabel = createEdgeNameLabel(message.getName(),
         suffix.appendTo(NameLabelSuffix.SUFFIX, idGenerator.getOrCreateId(message)), 0.6d);
      builder.add(nameLabel);

      applyNotation(message, builder);

      return builder.build();
   }

   @Override
   public List<GModelElement> mapSiblings(final Message source) {
      var siblings = new ArrayList<GModelElement>();
      if (source.getSendEvent() == null) {
         var anchor = ModelFactory.eINSTANCE.createMessageAnchor();
         anchor.setId(idGenerator.getOrCreateId(source) + "_MessageAnchor");
         siblings.add(mapHandler.handle(anchor));
      }
      if (source.getReceiveEvent() == null) {
         var anchor = ModelFactory.eINSTANCE.createMessageAnchor();
         anchor.setId(idGenerator.getOrCreateId(source) + "_MessageAnchor");
         siblings.add(mapHandler.handle(anchor));
      }
      return siblings;
   }

   protected GLabel createEdgeNameLabel(final String name, final String id, final double position) {
      return createEdgeLabel(name, position, id, CoreTypes.LABEL_NAME,
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

   protected void applyNotation(final Message message, final GEdgeBuilder builder) {
      modelState.getIndex().getNotation(message, Edge.class).ifPresent(edge -> {
         if (message.getMessageSort() == MessageSort.CREATE_MESSAGE_LITERAL) {
            builder
               .targetId(idGenerator.getOrCreateId(((OccurrenceSpecification) message.getReceiveEvent()).getCovered()));
         }

         if (edge.getBendPoints() != null) {
            if (messageToSelf(message)) {
               selfMessageRouter(message, builder);
            } else {
               ArrayList<GPoint> bendPoints = new ArrayList<>();
               edge.getBendPoints().forEach(p -> bendPoints.add(GraphUtil.copy(p)));
               builder.addRoutingPoints(bendPoints);
            }
         }
      });
   }

   private void selfMessageRouter(final Message message, final GEdgeBuilder builder) {
      double verticalOffset = 44 + messageOccurrenceNodeDiameter / 2;
      double horizontalOffset = 50;
      modelState.getIndex().getNotation(
         ((OccurrenceSpecification) message.getSendEvent()).getCovered(), Shape.class).ifPresent(shape -> {

            addParallelOffsetRoutingPoint(builder, message.getSendEvent(), shape, verticalOffset, horizontalOffset);
            addParallelOffsetRoutingPoint(builder, message.getReceiveEvent(), shape, verticalOffset, horizontalOffset);

         });
   }

   private void addParallelOffsetRoutingPoint(final GEdgeBuilder builder, final MessageEnd messageEnd,
      final Shape parentShape,
      final double verticalOffset,
      final double horizontalOffset) {
      modelState.getIndex().getNotation(messageEnd, Shape.class)
         .ifPresent(sendShape -> {
            if (sendShape.getPosition() != null) {
               var newpos = GraphUtil.point(
                  parentShape.getSize().getWidth() / 2 + parentShape.getPosition().getX() + horizontalOffset,
                  sendShape.getPosition().getY() + parentShape.getPosition().getY() + verticalOffset);
               builder.addRoutingPoint(newpos);
            }
         });
   }

   private String getMessageEndId(final Message message, final NamedElement event) {
      if (event != null) {
         return idGenerator.getOrCreateId(event);
      }
      return idGenerator.getOrCreateId(message) + "_MessageAnchor";
   }

   protected List<String> edgeStyler(final Message message, final GEdgeBuilder builder) {

      List<String> styles = new ArrayList<>();
      styles.add(CoreCSS.EDGE);

      switch (message.getMessageSort()) {
         case REPLY_LITERAL:
            styles.addAll(List.of(CoreCSS.EDGE_DASHED, CoreCSS.Marker.TENT.end()));
            break;
         case CREATE_MESSAGE_LITERAL:
            styles.addAll(List.of(CoreCSS.EDGE_DASHED, CoreCSS.Marker.TENT.end()));
            break;
         case SYNCH_CALL_LITERAL:
            styles.add(CoreCSS.Marker.TRIANGLE.end());
            break;
         case ASYNCH_CALL_LITERAL:
            styles.add(CoreCSS.Marker.TENT.end());
            break;
         default:
            styles.add(CoreCSS.Marker.TRIANGLE.end());
      }

      switch (message.getMessageKind()) {
         case FOUND_LITERAL:
            break;
         case LOST_LITERAL:
            break;
      }
      return styles;

   }

   protected boolean messageToSelf(final Message message) {
      return (message.getSendEvent() != null && message.getReceiveEvent() != null)
         && ((OccurrenceSpecification) message.getSendEvent())
            .getCovered() == ((OccurrenceSpecification) message.getReceiveEvent()).getCovered();
   }
}
