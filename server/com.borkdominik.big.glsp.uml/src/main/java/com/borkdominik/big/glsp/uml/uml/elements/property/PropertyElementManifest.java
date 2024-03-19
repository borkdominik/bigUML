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
package com.borkdominik.big.glsp.uml.uml.elements.property;

import java.util.Set;

import com.borkdominik.big.glsp.server.core.features.suffix.BGSuffixContribution;
import com.borkdominik.big.glsp.server.core.manifest.BGRepresentationManifest;
import com.borkdominik.big.glsp.server.elements.manifest.integrations.BGEMFNodeElementManifest;
import com.borkdominik.big.glsp.server.features.autocomplete.BGAutocompleteContribution;
import com.borkdominik.big.glsp.server.features.property_palette.BGPropertyPaletteContribution;
import com.borkdominik.big.glsp.server.features.property_palette.provider.BGDefaultPropertyPaletteProvider;
import com.borkdominik.big.glsp.uml.uml.UMLTypes;
import com.borkdominik.big.glsp.uml.uml.elements.feature.FeaturePropertyProvider;
import com.borkdominik.big.glsp.uml.uml.elements.feature.StructuralFeaturePropertyProvider;
import com.borkdominik.big.glsp.uml.uml.elements.multiplicity_element.MultiplicityElementPropertyProvider;
import com.borkdominik.big.glsp.uml.uml.elements.named_element.NamedElementLabelEditHandler;
import com.borkdominik.big.glsp.uml.uml.elements.named_element.NamedElementPropertyProvider;
import com.borkdominik.big.glsp.uml.uml.elements.property.features.PropertyAutocompleteEntriesProvider;
import com.borkdominik.big.glsp.uml.uml.elements.property.gmodel.PropertyGModelMapper;
import com.borkdominik.big.glsp.uml.uml.elements.property.gmodel.suffix.PropertyMultiplicityLabelSuffix;
import com.borkdominik.big.glsp.uml.uml.elements.property.gmodel.suffix.PropertyTypeLabelSuffix;
import com.borkdominik.big.glsp.uml.uml.elements.typed_element.TypedElementPropertyProvider;

public class PropertyElementManifest extends BGEMFNodeElementManifest {
   public PropertyElementManifest(final BGRepresentationManifest manifest) {
      super(manifest, Set.of(UMLTypes.PROPERTY));
   }

   @Override
   protected void configureElement() {
      bindGModelMapper(PropertyGModelMapper.class);
      bindConfiguration(PropertyConfiguration.class);
      bindCreateHandler(PropertyOperationHandler.class);
      bindEditLabel(Set.of(NamedElementLabelEditHandler.class));

      install(new BGSuffixContribution(BGSuffixContribution.Options.builder()
         .suffix((contribution) -> {
            contribution.addBinding(PropertyMultiplicityLabelSuffix.SUFFIX)
               .to(PropertyMultiplicityLabelSuffix.class);
            contribution.addBinding(PropertyTypeLabelSuffix.SUFFIX).to(PropertyTypeLabelSuffix.class);
         })
         .build()));

      bindPropertyPalette(BGPropertyPaletteContribution.Options.builder()
         .propertyProviders(Set.of(
            NamedElementPropertyProvider.class,
            MultiplicityElementPropertyProvider.class,
            FeaturePropertyProvider.class,
            StructuralFeaturePropertyProvider.class,
            TypedElementPropertyProvider.class)));

      bindAutocomplete(BGAutocompleteContribution.Options.builder()
         .providers(Set.of(PropertyAutocompleteEntriesProvider.class)));
   }
}
