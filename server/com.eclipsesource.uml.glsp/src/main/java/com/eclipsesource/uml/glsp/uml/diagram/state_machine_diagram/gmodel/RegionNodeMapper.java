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
package com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.gmodel;

import java.util.stream.Collectors;

import org.eclipse.glsp.graph.GCompartment;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.Region;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.diagram.UmlStateMachine_Region;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGNodeMapper;
import com.eclipsesource.uml.glsp.uml.gmodel.element.NamedElementGBuilder;

public class RegionNodeMapper extends BaseGNodeMapper<Region, GNode>
   implements NamedElementGBuilder<Region> {

   @Override
   public GNode map(final Region source) {
      var builder = new GNodeBuilder(UmlStateMachine_Region.typeId())
         .id(idGenerator.getOrCreateId(source))
         .layout(GConstants.Layout.VBOX)
         .addCssClass(CoreCSS.NODE)
         .addCssClass(CoreCSS.STROKE_DASHED)
         .add(buildHeader(source))
         .add(buildCompartment(source));

      applyShapeNotation(source, builder);

      return builder.build();
   }

   protected GCompartment buildHeader(final Region source) {
      var header = compartmentHeaderBuilder(source)
         .layout(GConstants.Layout.VBOX);

      header.add(buildIconVisibilityName(source, "--uml-region-icon"));

      return header.build();
   }

   protected GCompartment buildCompartment(final Region source) {
      var compartment = freeformChildrenCompartmentBuilder(source);

      var stateElements = source.getSubvertices().stream()
         .map(mapHandler::handle)
         .collect(Collectors.toList());
      compartment.addAll(stateElements);

      var transitions = source.getTransitions().stream()
         .map(mapHandler::handle)
         .collect(Collectors.toList());
      compartment.addAll(transitions);

      return compartment.build();
   }

}
