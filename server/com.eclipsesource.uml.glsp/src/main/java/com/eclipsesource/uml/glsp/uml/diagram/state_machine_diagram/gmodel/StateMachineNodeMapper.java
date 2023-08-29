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
import org.eclipse.uml2.uml.StateMachine;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.diagram.UmlStateMachine_StateMachine;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGNodeMapper;
import com.eclipsesource.uml.glsp.uml.gmodel.element.NamedElementGBuilder;

public class StateMachineNodeMapper extends BaseGNodeMapper<StateMachine, GNode>
   implements NamedElementGBuilder<StateMachine> {

   @Override
   public GNode map(final StateMachine source) {
      var builder = new GNodeBuilder(UmlStateMachine_StateMachine.typeId())
         .id(idGenerator.getOrCreateId(source))
         .layout(GConstants.Layout.VBOX) // TODO check layout
         .addCssClass(CoreCSS.NODE)
         .add(buildHeader(source))
         .add(buildCompartment(source));

      applyShapeNotation(source, builder);

      return builder.build();
   }

   protected GCompartment buildHeader(final StateMachine source) {
      var header = compartmentHeaderBuilder(source)
         .layout(GConstants.Layout.VBOX);

      header.add(textBuilder(source, "State Machine").build());
      header.add(buildIconVisibilityName(source, "--uml-state-machine-icon"));

      return header.build();
   }

   protected GCompartment buildCompartment(final StateMachine source) {
      var compartment = freeformChildrenCompartmentBuilder(source);

      var stateElements = source.getRegions().stream()
         .map(mapHandler::handle)
         .collect(Collectors.toList());
      compartment.addAll(stateElements);

      return compartment.build();
   }
}
