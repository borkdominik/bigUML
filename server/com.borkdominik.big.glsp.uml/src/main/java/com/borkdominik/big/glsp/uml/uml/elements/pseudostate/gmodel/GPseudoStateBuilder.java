/********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.borkdominik.big.glsp.uml.uml.elements.pseudostate.gmodel;

import java.util.List;

import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.impl.GLabelBuilder;
import org.eclipse.uml2.uml.Pseudostate;

import com.borkdominik.big.glsp.server.core.constants.BGCoreTypes;
import com.borkdominik.big.glsp.server.sdk.cdk.GCModelContext;
import com.borkdominik.big.glsp.server.sdk.cdk.base.GCProvider;
import com.borkdominik.big.glsp.server.sdk.cdk.gmodel.GCModelElement;
import com.borkdominik.big.glsp.server.sdk.cdk.gmodel.GCModelList;
import com.borkdominik.big.glsp.server.sdk.ui.builder.GCNodeBuilder;

public class GPseudoStateBuilder<TOrigin extends Pseudostate> extends GCNodeBuilder<TOrigin> {

   public GPseudoStateBuilder(final GCModelContext context, final TOrigin origin, final String type) {
      super(context, origin, type);
   }

   @Override
   protected List<GCProvider> createComponentChildren(final GNode modelRoot, final GCModelList<?, ?> componentRoot) {
      return List.of(createIcon(componentRoot));
   }

   protected GCProvider createIcon(final GCModelList<?, ?> container) {
      var iconString = "";

      switch (origin.getKind()) {
         case CHOICE_LITERAL:
            iconString = "--uml-pseudostate-choice-icon";
            break;
         case INITIAL_LITERAL:
            iconString = "--uml-pseudostate-initial-icon";
            break;
         case SHALLOW_HISTORY_LITERAL:
            iconString = "--uml-pseudostate-shallow-history-icon";
            break;
         case DEEP_HISTORY_LITERAL:
            iconString = "--uml-pseudostate-deep-history-icon";
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
            break;
         case JOIN_LITERAL:
            iconString = "--uml-pseudostate-join-icon";
            break;
         default:
            iconString = "--uml-pseudostate-icon";
      }

      return new GCModelElement<>(context, origin, new GLabelBuilder(BGCoreTypes.ICON_CSS)
         .id(context.idGenerator.getOrCreateId(origin) + "_icon")
         .addArgument("property", iconString).build());
   }
}