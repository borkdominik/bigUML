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
package com.eclipsesource.uml.glsp.uml.activity_diagram.gmodel;

public class ActivityDiagramEdgeFactory { /*-

   public ActivityDiagramEdgeFactory(final UmlModelState modelState) {
      super(modelState);
   }

   @Override
   public GEdge create(final ActivityEdge edge) {
      ActivityNode source = edge.getSource();
      ActivityNode target = edge.getTarget();

      String sourceId = toId(source);
      String targetId = toId(target);

      if (source instanceof Pin) {
         sourceId += "_port";
      }
      if (target instanceof Pin) {
         targetId += "_port";
      }

      GEdgeBuilder builder = new GEdgeBuilder(ActivityTypes.CONTROLFLOW) //
         .id(toId(edge)) //
         .addCssClass(CSS.EDGE) //
         .sourceId(sourceId) //
         .targetId(targetId) //
         .routerKind(GConstants.RouterKind.MANHATTAN);

      if (edge.getGuard() != null) {
         builder
            .add(createGuardLabel(getLiteralStringValue(edge.getGuard()), ActivityIdUtil.createGuardLabelId(toId(edge)),
               0.5d));
      }
      if (edge.getWeight() != null) {
         builder.add(
            createWeightLabel(getLiteralStringValue(edge.getWeight()), ActivityIdUtil.createWeightLabelId(toId(edge)),
               0.5d));
      }

      modelState.getIndex().getNotation(edge, Edge.class).ifPresent(elem -> {
         if (elem.getBendPoints() != null) {
            ArrayList<GPoint> gPoints = new ArrayList<>();
            elem.getBendPoints().forEach(p -> gPoints.add(GraphUtil.copy(p)));
            builder.addRoutingPoints(gPoints);
         }
      });
      return builder.build();
   }

   public GEdge create(final ExceptionHandler handler) {
      ExecutableNode source = handler.getProtectedNode();
      ObjectNode target = handler.getExceptionInput();

      String sourceId = toId(source);
      String targetId = toId(target) + "_port";

      GEdgeBuilder builder = new GEdgeBuilder(ActivityTypes.EXCEPTIONHANDLER) //
         .id(toId(handler)) //
         .addCssClass(CSS.EDGE) //
         .addCssClass(CSS.EDGE_DIRECTED_END_TENT) //
         .sourceId(sourceId) //
         .targetId(targetId) //
         .routerKind(GConstants.RouterKind.POLYLINE);

      return builder.build();
   }

   protected GLabel createGuardLabel(final String name, final String id, final double position) {
      return createEdgeLabel(name, position, id, ActivityTypes.LABEL_GUARD, GConstants.EdgeSide.TOP);
   }

   protected GLabel createWeightLabel(final String name, final String id, final double position) {
      return createEdgeLabel(name, position, id, ActivityTypes.LABEL_WEIGHT, GConstants.EdgeSide.BOTTOM);
   }

   private String getLiteralStringValue(final ValueSpecification vs) {
      if (vs instanceof LiteralString) {
         return ((LiteralString) vs).getValue();
      }
      return "no string literal";

   }

   protected GLabel createEdgeLabel(final String name, final double position, final String id, final String type,
      final String side) {
      return new GLabelBuilder(type) //
         .edgePlacement(new GEdgePlacementBuilder()//
            .side(side)//
            .position(position)//
            .offset(2d) //
            .rotate(false) //
            .build())//
         .id(id) //
         .text(name).build();
   }
   */
}
