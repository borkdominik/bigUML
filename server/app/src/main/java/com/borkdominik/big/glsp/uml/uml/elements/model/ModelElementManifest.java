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
package com.borkdominik.big.glsp.uml.uml.elements.model;

import java.util.Set;

import com.borkdominik.big.glsp.server.core.manifest.BGRepresentationManifest;
import com.borkdominik.big.glsp.server.elements.manifest.integrations.BGEMFNodeElementManifest;
import com.borkdominik.big.glsp.server.features.property_palette.BGPropertyPaletteContribution;
import com.borkdominik.big.glsp.uml.uml.UMLTypes;
import com.borkdominik.big.glsp.uml.uml.elements.model.gmodel.ModelGModelMapper;
import com.borkdominik.big.glsp.uml.uml.elements.named_element.NamedElementLabelEditHandler;
import com.borkdominik.big.glsp.uml.uml.elements.named_element.NamedElementPropertyProvider;

public class ModelElementManifest extends BGEMFNodeElementManifest {
   public ModelElementManifest(final BGRepresentationManifest manifest) {
      super(manifest, Set.of(UMLTypes.MODEL));
   }

   @Override
   protected void configureElement() {
      bindGModelMapper(ModelGModelMapper.class);
      bindConfiguration(ModelConfiguration.class);
      bindCreateHandler(ModelOperationHandler.class);
      bindEditLabel(Set.of(NamedElementLabelEditHandler.class));
      bindPropertyPalette(BGPropertyPaletteContribution.Options.builder()
         .propertyProviders(Set.of(
            NamedElementPropertyProvider.class)));
   }
}
