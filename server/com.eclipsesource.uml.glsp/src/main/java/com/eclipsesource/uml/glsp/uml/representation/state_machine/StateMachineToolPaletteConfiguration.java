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
package com.eclipsesource.uml.glsp.uml.representation.state_machine;

import java.util.List;
import java.util.Map;

import org.eclipse.glsp.server.features.toolpalette.PaletteItem;
import org.eclipse.uml2.uml.FinalState;
import org.eclipse.uml2.uml.Pseudostate;
import org.eclipse.uml2.uml.Region;
import org.eclipse.uml2.uml.State;
import org.eclipse.uml2.uml.StateMachine;
import org.eclipse.uml2.uml.Transition;

import com.eclipsesource.uml.glsp.core.features.tool_palette.PaletteItemUtil;
import com.eclipsesource.uml.glsp.uml.elements.pseudostate.PseudostateConfiguration;
import com.eclipsesource.uml.glsp.uml.features.tool_palette.RepresentationToolPaletteConfiguration;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public class StateMachineToolPaletteConfiguration extends RepresentationToolPaletteConfiguration {
   public StateMachineToolPaletteConfiguration() {
      super(Representation.STATE_MACHINE);
   }

   @Override
   public List<PaletteItem> getItems(final Map<String, String> args) {
      return List.of(containers(), pseudoStates(), edges());
   }

   private PaletteItem containers() {
      var containers = List.of(
         PaletteItemUtil.node(configurationFor(StateMachine.class).typeId(), "StateMachine", "uml-state-machine-icon"),
         PaletteItemUtil.node(configurationFor(State.class).typeId(), "State", "uml-state-icon"),
         PaletteItemUtil.node(configurationFor(Region.class).typeId(), "Region", "uml-region-icon"));

      return PaletteItem.createPaletteGroup("uml.classifier", "Container", containers, "symbol-property");
   }

   private PaletteItem pseudoStates() {

      var pseudoStates = List.of(
         PaletteItemUtil.node(configurationFor(Pseudostate.class, PseudostateConfiguration.class).initialStateTypeId(),
            "InitialState", "uml-pseudostate-initial-icon"),
         PaletteItemUtil.node(configurationFor(FinalState.class).typeId(), "FinalState", "uml-final-state-icon"),
         PaletteItemUtil.node(configurationFor(Pseudostate.class, PseudostateConfiguration.class).choiceTypeId(),
            "Choice", "uml-pseudostate-choice-icon"),
         PaletteItemUtil.node(configurationFor(Pseudostate.class, PseudostateConfiguration.class).joinTypeId(), "Join",
            "uml-pseudostate-join-icon"),
         PaletteItemUtil.node(configurationFor(Pseudostate.class, PseudostateConfiguration.class).forkTypeId(), "Fork",
            "uml-pseudostate-fork-icon"),
         PaletteItemUtil.node(configurationFor(Pseudostate.class, PseudostateConfiguration.class).deepHistoryTypeId(),
            "DeepHistory", "uml-pseudostate-deep-history-icon"),
         PaletteItemUtil.node(
            configurationFor(Pseudostate.class, PseudostateConfiguration.class).shallowHistoryTypeId(),
            "ShallowHistory",
            "uml-pseudostate-shallow-history-icon"));

      return PaletteItem.createPaletteGroup("uml.classifier", "PseudoStates", pseudoStates, "symbol-property");
   }

   private PaletteItem edges() {
      var edges = List.of(
         PaletteItemUtil.edge(configurationFor(Transition.class).typeId(), "Transition", "uml-transition-icon"));

      return PaletteItem.createPaletteGroup("uml.relation", "Transition", edges, "export");
   }
}
