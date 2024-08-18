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
package com.borkdominik.big.glsp.uml.uml.representation.state_machine;

import java.util.List;
import java.util.Map;

import org.eclipse.glsp.server.features.toolpalette.PaletteItem;

import com.borkdominik.big.glsp.server.core.features.tool_palette.BGBaseToolPaletteProvider;
import com.borkdominik.big.glsp.server.core.features.tool_palette.BGPaletteItemUtil;
import com.borkdominik.big.glsp.uml.uml.UMLTypes;
import com.borkdominik.big.glsp.uml.unotation.Representation;

public final class StateMachineToolPaletteProvider extends BGBaseToolPaletteProvider {
   public StateMachineToolPaletteProvider() {
      super(Representation.STATE_MACHINE);
   }

   @Override
   public List<PaletteItem> getItems(final Map<String, String> args) {
      var containers = List.of(
         BGPaletteItemUtil.node(UMLTypes.STATE_MACHINE.prefix(representation), "StateMachine",
            "uml-state-machine-icon"),
         BGPaletteItemUtil.node(UMLTypes.STATE.prefix(representation), "State", "uml-state-icon"),
         BGPaletteItemUtil.node(UMLTypes.REGION.prefix(representation), "Region", "uml-region-icon"));

      var pseudoStates = List.of(
         BGPaletteItemUtil.node(UMLTypes.INITIAL_STATE.prefix(representation), "InitialState",
            "uml-pseudostate-initial-icon"),
         BGPaletteItemUtil.node(UMLTypes.FINAL_STATE.prefix(representation), "FinalState", "uml-final-state-icon"),
         BGPaletteItemUtil.node(UMLTypes.CHOICE.prefix(representation), "Choice", "uml-pseudostate-choice-icon"),
         BGPaletteItemUtil.node(UMLTypes.JOIN.prefix(representation), "Join", "uml-pseudostate-join-icon"),
         BGPaletteItemUtil.node(UMLTypes.FORK.prefix(representation), "Fork", "uml-pseudostate-fork-icon"),
         BGPaletteItemUtil.node(UMLTypes.DEEP_HISTORY.prefix(representation), "DeepHistory",
            "uml-pseudostate-deep-history-icon"),
         BGPaletteItemUtil.node(UMLTypes.SHALLOW_HISTORY.prefix(representation), "ShallowHistory",
            "uml-pseudostate-shallow-history-icon"));

      var edges = List.of(
         BGPaletteItemUtil.edge(UMLTypes.TRANSITION.prefix(representation), "Transition", "uml-transition-icon"));

      return List.of(
         PaletteItem.createPaletteGroup("uml.palette-container", "Container", containers, "symbol-property"),
         PaletteItem.createPaletteGroup("uml.palette-pseudo-states", "PseudoStates", pseudoStates, "symbol-property"),
         PaletteItem.createPaletteGroup("uml.palette-edges", "Transition", edges, "symbol-property"));
   }
}
