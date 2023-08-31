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
package com.eclipsesource.uml.glsp.uml.elements.transition.gmodel;

import org.eclipse.glsp.graph.GEdge;
import org.eclipse.glsp.graph.GLabel;
import org.eclipse.glsp.graph.builder.impl.GEdgeBuilder;
import org.eclipse.glsp.graph.builder.impl.GEdgePlacementBuilder;
import org.eclipse.glsp.graph.builder.impl.GLabelBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.Transition;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.core.constants.CoreTypes;
import com.eclipsesource.uml.glsp.core.gmodel.suffix.NameLabelSuffix;
import com.eclipsesource.uml.glsp.uml.gmodel.RepresentationGEdgeMapper;
import com.eclipsesource.uml.glsp.uml.gmodel.element.EdgeGBuilder;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class TransitionEdgeMapper extends RepresentationGEdgeMapper<Transition, GEdge>
   implements EdgeGBuilder {

   @Inject
   public TransitionEdgeMapper(@Assisted final Representation representation) {
      super(representation);
   }

   @Override
   public GEdge map(final Transition transition) {
      var builder = new GEdgeBuilder(configuration().typeId())
         .id(idGenerator.getOrCreateId(transition))
         .addCssClass(CoreCSS.EDGE)
         .addCssClass(CoreCSS.NO_STROKE)
         .addCssClass(CoreCSS.Marker.TENT.end())
         .sourceId(idGenerator.getOrCreateId(transition.getSource()))
         .targetId(idGenerator.getOrCreateId(transition.getTarget()))
         .routerKind(GConstants.RouterKind.POLYLINE);
      var nameLabel = createTransitionNameLabel(transition.getName(),
         suffix.appendTo(NameLabelSuffix.SUFFIX, idGenerator.getOrCreateId(transition)), 0.6d);
      builder.add(nameLabel);

      applyEdgeNotation(transition, builder);

      return builder.build();
   }

   protected GLabel createTransitionNameLabel(final String name, final String id, final Double position) {
      return createTransitionLabel(name, position, id, CoreTypes.LABEL_NAME, GConstants.EdgeSide.TOP);
   }

   protected GLabel createTransitionLabel(final String name, final Double position, final String id, final String type,
      final String side) {
      return new GLabelBuilder(type)
         .edgePlacement(new GEdgePlacementBuilder().side(side).position(position).rotate(false).build())
         .id(id)
         .text(name)
         .build();
   }

}
