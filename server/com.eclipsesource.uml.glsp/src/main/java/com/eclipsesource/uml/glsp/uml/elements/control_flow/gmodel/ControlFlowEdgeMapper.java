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
package com.eclipsesource.uml.glsp.uml.elements.control_flow.gmodel;

import java.util.List;

import org.eclipse.glsp.graph.GEdge;
import org.eclipse.glsp.graph.GLabel;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.graph.builder.impl.GEdgeBuilder;
import org.eclipse.glsp.graph.builder.impl.GEdgePlacementBuilder;
import org.eclipse.glsp.graph.builder.impl.GLabelBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.ControlFlow;
import org.eclipse.uml2.uml.ValueSpecification;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.core.constants.CoreTypes;
import com.eclipsesource.uml.glsp.uml.elements.control_flow.gmodel.suffix.GuardLabelSuffix;
import com.eclipsesource.uml.glsp.uml.elements.control_flow.gmodel.suffix.WeightLabelSuffix;
import com.eclipsesource.uml.glsp.uml.gmodel.RepresentationGEdgeMapper;
import com.eclipsesource.uml.glsp.uml.gmodel.element.EdgeGBuilder;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class ControlFlowEdgeMapper extends RepresentationGEdgeMapper<ControlFlow, GEdge>
   implements EdgeGBuilder {

   @Inject
   public ControlFlowEdgeMapper(@Assisted final Representation representation) {
      super(representation);
   }

   @Override
   public GEdge map(final ControlFlow edge) {
      var source = edge.getSource();
      var sourceId = idGenerator.getOrCreateId(source);
      var target = edge.getTarget();
      var targetId = idGenerator.getOrCreateId(target);

      var edgeId = idGenerator.getOrCreateId(edge);

      GEdgeBuilder builder = new GEdgeBuilder(configuration().typeId())
         .id(edgeId)
         .addCssClasses(List.of(CoreCSS.EDGE))
         .addCssClass(CoreCSS.Marker.TENT.end())
         .sourceId(sourceId)
         .targetId(targetId)
         .routerKind(GConstants.RouterKind.POLYLINE);

      if (edge.getGuard() != null) {
         builder.add(createGuardLabel(edge.getGuard(), edgeId));
      }

      if (edge.getWeight() != null) {
         builder.add(createWeightLabel(edge.getWeight(), edgeId));
      }

      applyEdgeNotation(edge, builder);

      return builder.build();
   }

   private GModelElement createWeightLabel(final ValueSpecification weight, final String edgeId) {
      var edgePlacement = new GEdgePlacementBuilder().side(GConstants.EdgeSide.TOP).position(0.5d).rotate(true)
         .offset(10d)
         .build();
      var labelId = suffix.appendTo(WeightLabelSuffix.SUFFIX, edgeId);

      return new GLabelBuilder(CoreTypes.LABEL_NAME)
         .edgePlacement(edgePlacement)
         .id(labelId)
         .text("{weight=" + weight.integerValue() + "}")
         .build();
   }

   private GLabel createGuardLabel(final ValueSpecification valueSpecification, final String edgeId) {
      var edgePlacement = new GEdgePlacementBuilder().side(GConstants.EdgeSide.BOTTOM).position(0.5d).rotate(true)
         .offset(10d)
         .build();
      var labelId = suffix.appendTo(GuardLabelSuffix.SUFFIX, edgeId);

      return new GLabelBuilder(CoreTypes.LABEL_NAME)
         .edgePlacement(edgePlacement)
         .id(labelId)
         .text("[" + valueSpecification.stringValue() + "]")
         .build();
   }
}
