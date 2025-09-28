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
package com.borkdominik.big.glsp.uml.uml.elements.parameter;

import java.util.Set;

import com.borkdominik.big.glsp.server.core.manifest.BGRepresentationManifest;
import com.borkdominik.big.glsp.server.elements.manifest.integrations.BGEMFNodeElementManifest;
import com.borkdominik.big.glsp.server.features.property_palette.BGPropertyPaletteContribution;
import com.borkdominik.big.glsp.uml.uml.UMLTypes;
import com.borkdominik.big.glsp.uml.uml.elements.multiplicity_element.MultiplicityElementPropertyProvider;
import com.borkdominik.big.glsp.uml.uml.elements.named_element.NamedElementLabelEditHandler;
import com.borkdominik.big.glsp.uml.uml.elements.named_element.NamedElementPropertyProvider;
import com.borkdominik.big.glsp.uml.uml.elements.parameter.features.ParameterPropertyProvider;
import com.borkdominik.big.glsp.uml.uml.elements.parameter.gmodel.ParameterGModelMapper;
import com.borkdominik.big.glsp.uml.uml.elements.typed_element.TypedElementPropertyProvider;

public class ParameterElementManifest extends BGEMFNodeElementManifest {
   public ParameterElementManifest(final BGRepresentationManifest manifest) {
      super(manifest, Set.of(UMLTypes.PARAMETER));
   }

   @Override
   protected void configureElement() {
      bindGModelMapper(ParameterGModelMapper.class);
      bindConfiguration(ParameterConfiguration.class);
      bindCreateHandler(ParameterOperationHandler.class);
      bindEditLabel(Set.of(NamedElementLabelEditHandler.class));
      bindPropertyPalette(BGPropertyPaletteContribution.Options.builder()
            .propertyProviders(Set.of(
                  NamedElementPropertyProvider.class,
                  MultiplicityElementPropertyProvider.class,
                  ParameterPropertyProvider.class,
                  TypedElementPropertyProvider.class)));
   }
}
