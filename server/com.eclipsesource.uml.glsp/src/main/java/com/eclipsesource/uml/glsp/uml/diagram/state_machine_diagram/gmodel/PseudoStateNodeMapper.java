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

import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.uml2.uml.Pseudostate;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.diagram.UmlStateMachine_Choice;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.diagram.UmlStateMachine_DeepHistory;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.diagram.UmlStateMachine_Fork;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.diagram.UmlStateMachine_InitialState;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.diagram.UmlStateMachine_Join;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.diagram.UmlStateMachine_ShallowHistory;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGNodeMapper;
import com.eclipsesource.uml.glsp.uml.gmodel.element.NamedElementGBuilder;

public class PseudoStateNodeMapper extends BaseGNodeMapper<Pseudostate, GNode>
   implements NamedElementGBuilder<Pseudostate> {

   @Override
   public GNode map(final Pseudostate source) {

      var iconString = "";
      var typeId = "";

      switch (source.getKind()) {
         case CHOICE_LITERAL:
            iconString = "--uml-pseudostate-choice-icon";
            typeId = UmlStateMachine_Choice.typeId();
            break;
         case INITIAL_LITERAL:
            iconString = "--uml-pseudostate-initial-icon";
            typeId = UmlStateMachine_InitialState.typeId();
            break;
         case SHALLOW_HISTORY_LITERAL:
            iconString = "--uml-pseudostate-shallow-history-icon";
            typeId = UmlStateMachine_ShallowHistory.typeId();
            break;
         case DEEP_HISTORY_LITERAL:
            iconString = "--uml-pseudostate-deep-history-icon";
            typeId = UmlStateMachine_DeepHistory.typeId();
            break;
         case JUNCTION_LITERAL:
            iconString = "--uml-pseudostate-junction-icon";
            // typeId = UmlStateMachine_InitialState.typeId();
            break;
         case ENTRY_POINT_LITERAL:
            iconString = "--uml-pseudostate-entry-point-icon";
            // typeId = UmlStateMachine_InitialState.typeId();
            break;
         case EXIT_POINT_LITERAL:
            iconString = "--uml-pseudostate-exit-point-icon";
            // typeId = UmlStateMachine_InitialState.typeId();
            break;
         case FORK_LITERAL:
            iconString = "--uml-pseudostate-fork-icon";
            typeId = UmlStateMachine_Fork.typeId();
            break;
         case JOIN_LITERAL:
            iconString = "--uml-pseudostate-join-icon";
            typeId = UmlStateMachine_Join.typeId();
            break;
         default:
            iconString = "--uml-pseudostate-icon";
      }

      var builder = new GNodeBuilder(typeId)
         .id(idGenerator.getOrCreateId(source))
         .addCssClass(CoreCSS.NO_STROKE);
      // .add(iconFromCssPropertyBuilder(source, iconString).build());
      applyShapeNotation(source, builder);

      return builder.build();
   }
}
