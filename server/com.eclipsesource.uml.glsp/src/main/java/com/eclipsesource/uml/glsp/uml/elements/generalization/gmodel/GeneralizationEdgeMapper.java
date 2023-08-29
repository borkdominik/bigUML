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
package com.eclipsesource.uml.glsp.uml.elements.generalization.gmodel;

import org.eclipse.glsp.graph.GEdge;
import org.eclipse.glsp.graph.builder.impl.GArguments;
import org.eclipse.glsp.graph.builder.impl.GEdgeBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.Generalization;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.uml.gmodel.RepresentationGEdgeMapper;
import com.eclipsesource.uml.glsp.uml.gmodel.element.EdgeGBuilder;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class GeneralizationEdgeMapper extends RepresentationGEdgeMapper<Generalization, GEdge>
   implements EdgeGBuilder {

   @Inject
   public GeneralizationEdgeMapper(@Assisted final Representation representation) {
      super(representation);
   }

   @Override
   public GEdge map(final Generalization source) {
      var specific = source.getSpecific();
      var specificId = idGenerator.getOrCreateId(specific);
      var general = source.getGeneral();
      var generalId = idGenerator.getOrCreateId(general);

      GEdgeBuilder builder = new GEdgeBuilder(configuration().typeId())
         .id(idGenerator.getOrCreateId(source))
         .addCssClass(CoreCSS.EDGE)
         .addCssClass(CoreCSS.Marker.TRIANGLE_EMPTY.end())
         .sourceId(specificId)
         .targetId(generalId)
         .routerKind(GConstants.RouterKind.POLYLINE)
         .addArgument(GArguments.edgePadding(10));

      applyEdgeNotation(source, builder);

      return builder.build();
   }
}
