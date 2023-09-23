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
package com.eclipsesource.uml.glsp.uml.elements.activity_node.gmodel.actions;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.eclipse.glsp.graph.GCompartment;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.OpaqueAction;
import org.eclipse.uml2.uml.Pin;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.uml.elements.activity_node.ActivityNodeConfiguration;
import com.eclipsesource.uml.glsp.uml.gmodel.RepresentationGNodeMapper;
import com.eclipsesource.uml.glsp.uml.gmodel.element.NamedElementGBuilder;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class OpaqueActionNodeMapper extends RepresentationGNodeMapper<OpaqueAction, GNode>
   implements NamedElementGBuilder<OpaqueAction> {

   @Inject
   public OpaqueActionNodeMapper(@Assisted final Representation representation) {
      super(representation);
   }

   @Override
   public GNode map(final OpaqueAction source) {
      var pins = new ArrayList<Pin>();
      pins.addAll(source.getInputs());
      pins.addAll(source.getOutputs());

      var builder = new GNodeBuilder(configuration(ActivityNodeConfiguration.class).opaqueActionTypeId())
         .id(idGenerator.getOrCreateId(source))
         .layout(GConstants.Layout.VBOX)
         .addCssClass(CoreCSS.NODE)
         .addCssClass(CoreCSS.NODE_CONTAINER)
         .add(buildHeader(source))
         .add(buildPins(source, pins));

      applyShapeNotation(source, builder);

      return builder.build();
   }

   @Override
   public List<GModelElement> mapSiblings(final OpaqueAction source) {
      var siblings = new ArrayList<GModelElement>();
      // siblings.addAll(mapHandler.handle(source.getOutgoings()));
      return siblings;
   }

   protected GCompartment buildHeader(final OpaqueAction source) {
      var header = compartmentHeaderBuilder(source)
         .layout(GConstants.Layout.VBOX);

      header.add(nameBuilder(source).build());

      return header.build();
   }

   protected GCompartment buildPins(final OpaqueAction source, final List<? extends Pin> pins) {
      return fixedChildrenCompartmentBuilder(source)
         .addAll(pins.stream()
            .map(mapHandler::handle)
            .collect(Collectors.toList()))
         .build();
   }
}
