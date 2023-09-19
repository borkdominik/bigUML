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
package com.eclipsesource.uml.glsp.uml.elements.activity_partition.gmodel;

import java.util.stream.Collectors;

// PartitionNodeMapper {

import org.eclipse.glsp.graph.GCompartment;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.ActivityPartition;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.uml.gmodel.RepresentationGNodeMapper;
import com.eclipsesource.uml.glsp.uml.gmodel.element.NamedElementGBuilder;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class ActivityPartitionNodeMapper extends RepresentationGNodeMapper<ActivityPartition, GNode>
   implements NamedElementGBuilder<ActivityPartition> {

   @Inject
   public ActivityPartitionNodeMapper(@Assisted final Representation representation) {
      super(representation);
   }

   @Override
   public GNode map(final ActivityPartition source) {
      var builder = new GNodeBuilder(configuration().typeId())
         .id(idGenerator.getOrCreateId(source))
         .layout(GConstants.Layout.VBOX)
         .addCssClass(CoreCSS.NODE)
         .addCssClass(CoreCSS.NODE_CONTAINER)
         // .addCssClass(CoreCSS.)
         .add(buildHeader(source))
         .add(buildCompartment(source));

      applyShapeNotation(source, builder);

      return builder.build();
   }

   protected GCompartment buildHeader(final ActivityPartition source) {
      var header = compartmentHeaderBuilder(source)
         .layout(GConstants.Layout.VBOX);

      header.add(nameBuilder(source).build());
      // header.add(buildIconVisibilityName(source, "--uml-activity-partition-icon"));

      return header.build();
   }

   protected GCompartment buildCompartment(final ActivityPartition source) {
      var builder = freeformChildrenCompartmentBuilder(source);

      builder.addAll(source.getSubpartitions().stream()
         .map(mapHandler::handle)
         .collect(Collectors.toList()));

      builder.addAll(source.getNodes().stream()
         .map(mapHandler::handle)
         .collect(Collectors.toList()));
      return builder.build();
   }
}
