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
package com.eclipsesource.uml.modelserver.uml.representation.state_machine;

import com.eclipsesource.uml.modelserver.core.manifest.DiagramManifest;
import com.eclipsesource.uml.modelserver.uml.elements.final_state.FinalStateDefinitionModule;
import com.eclipsesource.uml.modelserver.uml.elements.pseudostate.PseudostateDefinitionModule;
import com.eclipsesource.uml.modelserver.uml.elements.region.RegionDefinitionModule;
import com.eclipsesource.uml.modelserver.uml.elements.state.StateDefinitionModule;
import com.eclipsesource.uml.modelserver.uml.elements.state_machine.StateMachineDefinitionModule;
import com.eclipsesource.uml.modelserver.uml.elements.transition.TransitionDefinitionModule;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public class StateMachineManifest extends DiagramManifest {
   public StateMachineManifest() {
      super(Representation.STATE_MACHINE);
   }

   @Override
   protected void configure() {
      super.configure();
      install(new FinalStateDefinitionModule(this));
      install(new PseudostateDefinitionModule(this));
      install(new RegionDefinitionModule(this));
      install(new StateDefinitionModule(this));
      install(new StateMachineDefinitionModule(this));
      install(new TransitionDefinitionModule(this));
   }
}
