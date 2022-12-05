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
import org.eclipse.uml2.uml.Generalization;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.ClassTypes;
import com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.constants.CommunicationTypes;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGEdgeMapper;

public class GeneralizationEdgeMapper extends BaseGEdgeMapper<Generalization, GEdge> {

   @Override
   public GEdge map(final Generalization generalization) {
      var source = generalization.getSpecific();
      var sourceId = idGenerator.getOrCreateId(source);
      var target = generalization.getGeneral();
      var targetId = idGenerator.getOrCreateId(target);

      GEdgeBuilder builder = new GEdgeBuilder(ClassTypes.CLASS_GENERALIZATION)
         .id(idGenerator.getOrCreateId(generalization))
         .addCssClass(CoreCSS.EDGE)
         .addCssClass(CoreCSS.MARKER_TRIANGLE_EMPTY)
         .addCssClass(CoreCSS.MARKER_START)
         .sourceId(sourceId)
         .targetId(targetId)
         .routerKind(GConstants.RouterKind.MANHATTAN);

      applyEdgeNotation(generalization, builder);

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
