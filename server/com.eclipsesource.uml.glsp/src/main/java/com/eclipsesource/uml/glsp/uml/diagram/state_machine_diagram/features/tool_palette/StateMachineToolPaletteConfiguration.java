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
package com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.features.tool_palette;

import java.util.List;
import java.util.Map;

import org.eclipse.glsp.server.features.toolpalette.PaletteItem;

import com.eclipsesource.uml.glsp.core.features.tool_palette.PaletteItemUtil;
import com.eclipsesource.uml.glsp.core.features.tool_palette.ToolPaletteConfiguration;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.diagram.UmlStateMachine_Choice;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.diagram.UmlStateMachine_DeepHistory;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.diagram.UmlStateMachine_FinalState;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.diagram.UmlStateMachine_Fork;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.diagram.UmlStateMachine_InitialState;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.diagram.UmlStateMachine_Join;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.diagram.UmlStateMachine_Region;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.diagram.UmlStateMachine_ShallowHistory;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.diagram.UmlStateMachine_State;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.diagram.UmlStateMachine_StateMachine;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.diagram.UmlStateMachine_Transition;

public class StateMachineToolPaletteConfiguration implements ToolPaletteConfiguration {
   @Override
   public List<PaletteItem> getItems(final Map<String, String> args) {
      return List.of(containers(), pseudoStates(), edges());
   }

   private PaletteItem containers() {
      var containers = List.of(
         PaletteItemUtil.node(UmlStateMachine_StateMachine.typeId(), "StateMachine", "uml-state-machine-icon"),
         PaletteItemUtil.node(UmlStateMachine_State.typeId(), "State", "uml-state-icon"),
         PaletteItemUtil.node(UmlStateMachine_Region.typeId(), "Region", "uml-region-icon"));

      return PaletteItem.createPaletteGroup("uml.classifier", "Container", containers, "symbol-property");
   }

   private PaletteItem pseudoStates() {

      var pseudoStates = List.of(
         PaletteItemUtil.node(UmlStateMachine_InitialState.typeId(), "InitialState", "uml-pseudostate-initial-icon"),
         PaletteItemUtil.node(UmlStateMachine_FinalState.typeId(), "FinalState", "uml-final-state-icon"),
         PaletteItemUtil.node(UmlStateMachine_Choice.typeId(), "Choice", "uml-pseudostate-choice-icon"),
         PaletteItemUtil.node(UmlStateMachine_Join.typeId(), "Join", "uml-pseudostate-join-icon"),
         PaletteItemUtil.node(UmlStateMachine_Fork.typeId(), "Fork", "uml-pseudostate-fork-icon"),
         PaletteItemUtil.node(UmlStateMachine_DeepHistory.typeId(), "DeepHistory", "uml-pseudostate-deep-history-icon"),
         PaletteItemUtil.node(UmlStateMachine_ShallowHistory.typeId(), "ShallowHistory",
            "uml-pseudostate-shallow-history-icon"));

      return PaletteItem.createPaletteGroup("uml.classifier", "PseudoStates", pseudoStates, "symbol-property");
   }

   private PaletteItem edges() {
      var edges = List.of(
         PaletteItemUtil.edge(UmlStateMachine_Transition.typeId(), "Transition", "uml-transition-icon"));

      return PaletteItem.createPaletteGroup("uml.relation", "Transition", edges, "export");
   }
}
