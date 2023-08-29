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
package com.eclipsesource.uml.modelserver.uml.diagram.state_machine_diagram.manifest;

import com.eclipsesource.uml.modelserver.core.manifest.DiagramManifest;
import com.eclipsesource.uml.modelserver.core.manifest.contributions.CommandCodecContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.state_machine_diagram.commands.final_state.CreateFinalStateContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.state_machine_diagram.commands.final_state.DeleteFinalStateContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.state_machine_diagram.commands.pseudostate.CreatePseudoStateContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.state_machine_diagram.commands.pseudostate.DeletePseudoStateContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.state_machine_diagram.commands.region.CreateRegionContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.state_machine_diagram.commands.region.DeleteRegionContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.state_machine_diagram.commands.region.UpdateRegionContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.state_machine_diagram.commands.state.CreateStateContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.state_machine_diagram.commands.state.DeleteStateContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.state_machine_diagram.commands.state.UpdateStateContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.state_machine_diagram.commands.state.sub_state.CreateSubStateContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.state_machine_diagram.commands.state_machine.CreateStateMachineContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.state_machine_diagram.commands.state_machine.DeleteStateMachineContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.state_machine_diagram.commands.state_machine.UpdateStateMachineContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.state_machine_diagram.commands.transition.CreateTransitionContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.state_machine_diagram.commands.transition.DeleteTransitionContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.state_machine_diagram.commands.transition.UpdateTransitionContribution;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public class StateMachineManifest extends DiagramManifest implements CommandCodecContribution {
   public StateMachineManifest() {
      super(Representation.STATE_MACHINE);
   }

   @Override
   protected void configure() {
      super.configure();
      contributeCommandCodec(binder(), (contributions) -> {

         // State Machine
         contributions.addBinding(CreateStateMachineContribution.TYPE).to(CreateStateMachineContribution.class);
         contributions.addBinding(UpdateStateMachineContribution.TYPE).to(UpdateStateMachineContribution.class);
         contributions.addBinding(DeleteStateMachineContribution.TYPE).to(DeleteStateMachineContribution.class);

         // State
         contributions.addBinding(CreateStateContribution.TYPE).to(CreateStateContribution.class);
         contributions.addBinding(DeleteStateContribution.TYPE).to(DeleteStateContribution.class);
         contributions.addBinding(UpdateStateContribution.TYPE).to(UpdateStateContribution.class);

         // Sub State
         contributions.addBinding(CreateSubStateContribution.TYPE).to(CreateSubStateContribution.class);

         // Final State
         contributions.addBinding(CreateFinalStateContribution.TYPE).to(CreateFinalStateContribution.class);
         contributions.addBinding(DeleteFinalStateContribution.TYPE).to(DeleteFinalStateContribution.class);

         // Regions
         contributions.addBinding(CreateRegionContribution.TYPE).to(CreateRegionContribution.class);
         contributions.addBinding(UpdateRegionContribution.TYPE).to(UpdateRegionContribution.class);
         contributions.addBinding(DeleteRegionContribution.TYPE).to(DeleteRegionContribution.class);

         // PseudoState
         contributions.addBinding(CreatePseudoStateContribution.TYPE).to(CreatePseudoStateContribution.class);
         contributions.addBinding(DeletePseudoStateContribution.TYPE).to(DeletePseudoStateContribution.class);

         // Transition
         contributions.addBinding(CreateTransitionContribution.TYPE).to(CreateTransitionContribution.class);
         contributions.addBinding(DeleteTransitionContribution.TYPE).to(DeleteTransitionContribution.class);
         contributions.addBinding(UpdateTransitionContribution.TYPE).to(UpdateTransitionContribution.class);

      });
   }
}
