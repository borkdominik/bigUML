package com.borkdominik.big.glsp.uml.uml.representation.state_machine;

import org.eclipse.emf.common.util.Enumerator;

import com.borkdominik.big.glsp.server.core.features.direct_editing.implementations.BGEMFDefaultDirectEditHandler;
import com.borkdominik.big.glsp.server.core.handler.operation.delete.implementations.BGEMFDefaultDeleteHandler;
import com.borkdominik.big.glsp.server.core.manifest.BGRepresentationManifest;
import com.borkdominik.big.glsp.uml.uml.customizations.UMLDefaultPropertyPaletteProvider;
import com.borkdominik.big.glsp.uml.uml.customizations.UMLDefaultReconnectElementHandler;
import com.borkdominik.big.glsp.uml.uml.elements.final_state.FinalStateElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.pseudostate.PseudostateElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.region.RegionElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.state.StateElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.state_machine.StateMachineElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.transition.TransitionElementManifest;
import com.borkdominik.big.glsp.uml.unotation.Representation;

public class UMLStateMachineManifest extends BGRepresentationManifest {

   @Override
   public Enumerator representation() {
      return Representation.STATE_MACHINE;
   }

   @Override
   protected void configure() {
      super.configure();

      bindToolPalette(StateMachineToolPaletteProvider.class);
      bindDefaultDeleteOperation(BGEMFDefaultDeleteHandler.class);
      bindDefaultDirectEdit(BGEMFDefaultDirectEditHandler.class);
      bindDefaultReconnectOperation(UMLDefaultReconnectElementHandler.class);
      bindDefaultPropertyPalette(UMLDefaultPropertyPaletteProvider.class);

      install(new FinalStateElementManifest(this));
      install(new RegionElementManifest(this));
      install(new PseudostateElementManifest(this));
      install(new StateElementManifest(this));
      install(new StateMachineElementManifest(this));
      install(new TransitionElementManifest(this));

   }
}
