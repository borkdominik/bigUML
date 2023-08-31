package com.eclipsesource.uml.glsp.uml.representation.state_machine;

import com.eclipsesource.uml.glsp.core.manifest.DiagramManifest;
import com.eclipsesource.uml.glsp.uml.elements.final_state.FinalStateDefinitionModule;
import com.eclipsesource.uml.glsp.uml.elements.pseudostate.PseudostateDefinitionModule;
import com.eclipsesource.uml.glsp.uml.elements.region.RegionDefinitionModule;
import com.eclipsesource.uml.glsp.uml.elements.state.StateDefinitionModule;
import com.eclipsesource.uml.glsp.uml.elements.state_machine.StateMachineDefinitionModule;
import com.eclipsesource.uml.glsp.uml.elements.transition.TransitionDefinitionModule;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public class StateMachineManifest extends DiagramManifest {
   @Override
   public String id() {
      return representation().getName();
   }

   @Override
   public Representation representation() {
      return Representation.STATE_MACHINE;
   }

   @Override
   protected void configure() {
      super.configure();

      install(new FinalStateDefinitionModule(this));
      install(new RegionDefinitionModule(this));
      install(new PseudostateDefinitionModule(this));
      install(new StateDefinitionModule(this));
      install(new StateMachineDefinitionModule(this));
      install(new TransitionDefinitionModule(this));

      contributeToolPaletteConfiguration((contribution) -> {
         contribution.addBinding().to(StateMachineToolPaletteConfiguration.class);
      });
   }
}
