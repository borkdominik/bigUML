/********************************************************************************
 * Copyright (c) 2021-2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.elements.instance_specification.gmodel;

import java.util.stream.Collectors;

import org.eclipse.glsp.graph.GCompartment;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.InstanceSpecification;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.uml.gmodel.RepresentationGNodeMapper;
import com.eclipsesource.uml.glsp.uml.gmodel.element.NamedElementGBuilder;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class InstanceSpecificationNodeMapper extends RepresentationGNodeMapper<InstanceSpecification, GNode>
   implements NamedElementGBuilder<InstanceSpecification> {

   @Inject
   public InstanceSpecificationNodeMapper(@Assisted final Representation representation) {
      super(representation);
   }

   @Override
   public GNode map(final InstanceSpecification source) {
      var builder = new GNodeBuilder(configuration().typeId())
         .id(idGenerator.getOrCreateId(source))
         .layout(GConstants.Layout.VBOX)
         .addCssClass(CoreCSS.NODE)
         .add(buildHeader(source))
         .add(buildCompartment(source));

      applyShapeNotation(source, builder);

      return builder.build();
   }

   protected GCompartment buildHeader(final InstanceSpecification source) {
      var header = compartmentHeaderBuilder(source)
         .layout(GConstants.Layout.VBOX);
      header.add(buildIconVisibilityName(source, "--uml-instance-specification-icon"));

      return header.build();
   }

   protected GCompartment buildCompartment(final InstanceSpecification source) {
      var compartment = fixedChildrenCompartmentBuilder(source);

      var slotElements = source.getSlots().stream()
         .map(mapHandler::handle)
         .collect(Collectors.toList());
      compartment.addAll(slotElements);

      return compartment.build();
   }
}
