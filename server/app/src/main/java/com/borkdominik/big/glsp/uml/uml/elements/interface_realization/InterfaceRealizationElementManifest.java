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
package com.borkdominik.big.glsp.uml.uml.elements.interface_realization;

import java.util.Set;

import com.borkdominik.big.glsp.server.core.manifest.BGRepresentationManifest;
import com.borkdominik.big.glsp.server.elements.manifest.integrations.BGEMFEdgeElementManifest;
import com.borkdominik.big.glsp.server.features.property_palette.BGPropertyPaletteContribution;
import com.borkdominik.big.glsp.server.features.property_palette.provider.BGDefaultPropertyPaletteProvider;
import com.borkdominik.big.glsp.uml.uml.UMLTypes;
import com.borkdominik.big.glsp.uml.uml.elements.interface_realization.gmodel.InterfaceRealizationGModelMapper;
import com.borkdominik.big.glsp.uml.uml.elements.named_element.NamedElementPropertyProvider;

public class InterfaceRealizationElementManifest extends BGEMFEdgeElementManifest {
   public InterfaceRealizationElementManifest(final BGRepresentationManifest manifest) {
      super(manifest, Set.of(UMLTypes.INTERFACE_REALIZATION));
   }

   @Override
   protected void configureElement() {
      bindGModelMapper(InterfaceRealizationGModelMapper.class);
      bindConfiguration(InterfaceRealizationConfiguration.class);
      bindCreateHandler(InterfaceRealizationOperationHandler.class);
      bindPropertyPalette(BGPropertyPaletteContribution.Options.builder()
         .propertyProviders(Set.of(
            NamedElementPropertyProvider.class)));
   }
}
