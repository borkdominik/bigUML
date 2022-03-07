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

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.util.UmlConfig.CSS;
import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.eclipsesource.uml.glsp.util.UmlIDUtil;
import com.eclipsesource.uml.glsp.util.UmlLabelUtil;
import com.eclipsesource.uml.modelserver.unotation.Edge;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import org.eclipse.emf.common.util.EList;
import org.eclipse.glsp.graph.GEdge;
import org.eclipse.glsp.graph.GLabel;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.builder.impl.GEdgeBuilder;
import org.eclipse.glsp.graph.builder.impl.GEdgePlacementBuilder;
import org.eclipse.glsp.graph.builder.impl.GLabelBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.glsp.graph.util.GConstants.EdgeSide;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.uml2.uml.*;

import java.util.ArrayList;

public class UseCaseDiagramEdgeFactory extends AbstractGModelFactory<Relationship, GEdge> {

   public UseCaseDiagramEdgeFactory(final UmlModelState modelState) {
      super(modelState);
   }

   @Override
   public GEdge create(final Relationship element) {
      if (element instanceof Extend) {
         return createExtendEdge((Extend) element);
      } else if (element instanceof Include) {
         return createIncludeEdge((Include) element);
      } else if (element instanceof Generalization) {
         return createGeneralizationEdge((Generalization) element);
      }
      return null;
   }


   /**
    * Creates the GEdge for an Extend including the labels on the line.
    *
    * @param extend
    * @return
    */
   protected GEdge createExtendEdge(final Extend extend) {
      UseCase source = extend.getExtension();
      String sourceId = toId(source);
      UseCase target = extend.getExtendedCase();
      String targetId = toId(target);

      GEdgeBuilder builder = new GEdgeBuilder(Types.EXTEND)
         .id(toId(extend))
         .addCssClass(CSS.EDGE)
         .addCssClass(CSS.EDGE_DOTTED)
         .addCssClass(CSS.EDGE_DIRECTED_END_TENT)
         .sourceId(sourceId)
         .targetId(targetId)
         .routerKind(GConstants.RouterKind.MANHATTAN);

      GLabel extendLable = createEdgeLabel("<<extends>>", 0.5d,
         targetId + "_" + sourceId + "_" + toId(extend) + "_label", Types.LABEL_TEXT,
         EdgeSide.TOP);
      builder.add(extendLable);

      // TODO: check if we need this for anything else
      /*builder.add(new GLabelBuilder(Types.CONNECTIONPOINT)
         .addCssClass(CSS.LABEL_TRANSPARENT)
         .edgePlacement(new GEdgePlacementBuilder()
            .side(EdgeSide.TOP)
            .position(0.5d)
            .offset(2d)
            .rotate(false)
            .build())
         .id(toId(extend) + "_anchor")
         .build());*/

      modelState.getIndex().getNotation(extend, Edge.class).ifPresent(edge -> {
         if (edge.getBendPoints() != null) {
            ArrayList<GPoint> bendPoints = new ArrayList<>();
            edge.getBendPoints().forEach(p -> bendPoints.add(GraphUtil.copy(p)));
            builder.addRoutingPoints(bendPoints);
         }
      });
      return builder.build();
   }

   /**
    * Creates the GEdge for an Include including the labels on the line.
    *
    * @param include
    * @return
    */
   protected GEdge createIncludeEdge(final Include include) {
      UseCase source = include.getIncludingCase();
      String sourceId = toId(source);
      UseCase target = include.getAddition();
      String targetId = toId(target);

      GEdgeBuilder builder = new GEdgeBuilder(Types.INCLUDE)
         .id(toId(include))
         .addCssClass(CSS.EDGE)
         .addCssClass(CSS.EDGE_DASHED)
         .addCssClass(CSS.EDGE_DIRECTED_END_TENT)
         .sourceId(sourceId)
         .targetId(targetId)
         .routerKind(GConstants.RouterKind.MANHATTAN);

      GLabel includeLabel = createEdgeLabel("<<includes>>", 0.5d,
         targetId + "_" + sourceId + "_" + toId(include) + "_label", Types.LABEL_TEXT,
         EdgeSide.TOP);
      builder.add(includeLabel);

      modelState.getIndex().getNotation(include, Edge.class).ifPresent(edge -> {
         if (edge.getBendPoints() != null) {
            ArrayList<GPoint> bendPoints = new ArrayList<>();
            edge.getBendPoints().forEach(p -> bendPoints.add(GraphUtil.copy(p)));
            builder.addRoutingPoints(bendPoints);
         }
      });
      return builder.build();
   }

   /**
    * Creates the GEdge for a Generalization.
    *
    * @param generalization
    * @return
    */
   protected GEdge createGeneralizationEdge(final Generalization generalization) {
      Classifier source = (Classifier) generalization.eContainer();
      String sourceId = toId(source);
      Classifier target = generalization.getGeneral();
      String targetId = toId(target);

      GEdgeBuilder builder = new GEdgeBuilder(Types.GENERALIZATION)
         .id(toId(generalization))
         .addCssClass(CSS.EDGE)
         .addCssClass(CSS.EDGE_DIRECTED_END_EMPTY)
         .sourceId(sourceId)
         .targetId(targetId)
         .routerKind(GConstants.RouterKind.MANHATTAN);

      modelState.getIndex().getNotation(generalization, Edge.class).ifPresent(edge -> {
         if (edge.getBendPoints() != null) {
            ArrayList<GPoint> bendPoints = new ArrayList<>();
            edge.getBendPoints().forEach(p -> bendPoints.add(GraphUtil.copy(p)));
            builder.addRoutingPoints(bendPoints);
         }
      });
      return builder.build();
   }

   // end region

   // region HELPERS

   /**
    * Creates a GLabel for the multiplicity of a Relationship
    *
    * @param value
    * @param id
    * @param position
    * @return The GLabel that can be added to the graph.
    */
   protected GLabel createEdgeMultiplicityLabel(final String value, final String id, final double position) {
      return createEdgeLabel(value, position, id, Types.LABEL_EDGE_MULTIPLICITY, EdgeSide.BOTTOM);
   }

   /**
    * Creates a name Label for a GEdge.
    *
    * @param name
    * @param id
    * @param position
    * @return The GLabel that can be added to the graph.
    */
   protected GLabel createEdgeNameLabel(final String name, final String id, final double position) {
      return createEdgeLabel(name, position, id, Types.LABEL_EDGE_NAME, EdgeSide.TOP);
   }

   /**
    * Generic method for creating Labels on Edges.
    *
    * @param name
    * @param position
    * @param id
    * @param type
    * @param side
    * @return A GLabel that can be added to the graph.
    */
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

   // endregion

}
