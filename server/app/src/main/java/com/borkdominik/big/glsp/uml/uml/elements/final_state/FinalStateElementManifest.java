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
package com.borkdominik.big.glsp.uml.uml.elements.final_state;

import java.util.Set;

import com.borkdominik.big.glsp.server.core.manifest.BGRepresentationManifest;
import com.borkdominik.big.glsp.server.elements.manifest.integrations.BGEMFNodeElementManifest;
import com.borkdominik.big.glsp.server.features.property_palette.BGPropertyPaletteContribution;
import com.borkdominik.big.glsp.uml.uml.UMLTypes;
import com.borkdominik.big.glsp.uml.uml.elements.final_state.gmodel.FinalStateGModelMapper;

public class FinalStateElementManifest extends BGEMFNodeElementManifest {
   public FinalStateElementManifest(final BGRepresentationManifest manifest) {
      super(manifest, Set.of(UMLTypes.FINAL_STATE));
   }

   @Override
   protected void configureElement() {
      bindGModelMapper(FinalStateGModelMapper.class);
      bindConfiguration(FinalStateConfiguration.class);
      bindCreateHandler(FinalStateOperationHandler.class);
      bindPropertyPalette(BGPropertyPaletteContribution.Options.builder()
         .propertyProviders(Set.of()));
   }
}
