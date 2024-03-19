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
package com.borkdominik.big.glsp.uml.uml.elements.interface_;

import java.util.Set;

import com.borkdominik.big.glsp.server.core.manifest.BGRepresentationManifest;
import com.borkdominik.big.glsp.server.elements.manifest.integrations.BGEMFNodeElementManifest;
import com.borkdominik.big.glsp.server.features.property_palette.BGPropertyPaletteContribution;
import com.borkdominik.big.glsp.server.features.property_palette.provider.BGDefaultPropertyPaletteProvider;
import com.borkdominik.big.glsp.uml.uml.UMLTypes;
import com.borkdominik.big.glsp.uml.uml.elements.attribute_owner.AttributeOwnerPropertyProvider;
import com.borkdominik.big.glsp.uml.uml.elements.classifier.ClassifierPropertyProvider;
import com.borkdominik.big.glsp.uml.uml.elements.interface_.gmodel.InterfaceGModelMapper;
import com.borkdominik.big.glsp.uml.uml.elements.named_element.NamedElementLabelEditHandler;
import com.borkdominik.big.glsp.uml.uml.elements.named_element.NamedElementPropertyProvider;
import com.borkdominik.big.glsp.uml.uml.elements.operation_owner.OperationOwnerPropertyProvider;

public class InterfaceElementManifest extends BGEMFNodeElementManifest {
   public InterfaceElementManifest(final BGRepresentationManifest manifest) {
      super(manifest, Set.of(UMLTypes.INTERFACE));
   }

   @Override
   protected void configureElement() {
      bindGModelMapper(InterfaceGModelMapper.class);
      bindConfiguration(InterfaceConfiguration.class);
      bindCreateHandler(InterfaceOperationHandler.class);
      bindEditLabel(Set.of(NamedElementLabelEditHandler.class));
      bindPropertyPalette(BGPropertyPaletteContribution.Options.builder()
         .propertyProviders(Set.of(
            NamedElementPropertyProvider.class,
            ClassifierPropertyProvider.class,
            AttributeOwnerPropertyProvider.class,
            OperationOwnerPropertyProvider.class)));
   }
}
