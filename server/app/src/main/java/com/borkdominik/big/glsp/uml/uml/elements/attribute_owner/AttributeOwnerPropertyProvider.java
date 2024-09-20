/********************************************************************************
 * Copyright (c) 2024 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.borkdominik.big.glsp.uml.uml.elements.attribute_owner;

import java.util.List;
import java.util.Set;

import org.eclipse.emf.common.util.Enumerator;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.uml2.uml.AttributeOwner;

import com.borkdominik.big.glsp.server.core.model.BGTypeProvider;
import com.borkdominik.big.glsp.server.features.property_palette.model.ElementPropertyBuilder;
import com.borkdominik.big.glsp.server.features.property_palette.model.ElementPropertyItem;
import com.borkdominik.big.glsp.server.features.property_palette.provider.integrations.BGEMFElementPropertyProvider;
import com.borkdominik.big.glsp.uml.uml.UMLTypes;
import com.borkdominik.big.glsp.uml.uml.elements.property.utils.PropertyPropertyPaletteUtils;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class AttributeOwnerPropertyProvider extends BGEMFElementPropertyProvider<EObject> {

   public static final String OWNED_ATTRIBUTES = "ownedAttributes";

   @Inject
   public AttributeOwnerPropertyProvider(@Assisted final Enumerator representation,
      @Assisted final Set<BGTypeProvider> elementTypes) {
      super(representation, elementTypes, Set.of(OWNED_ATTRIBUTES));
   }

   @Override
   public List<ElementPropertyItem> doProvide(final EObject element) {
      var elementId = providerContext.idGenerator().getOrCreateId(element);
      var builder = new ElementPropertyBuilder(elementId);

      if (providerContext.elementConfig().has(UMLTypes.PROPERTY) && element instanceof AttributeOwner e) {
         builder.reference(
            PropertyPropertyPaletteUtils.asReference(
               providerContext,
               elementId,
               OWNED_ATTRIBUTES,
               "Owned Attribute",
               e.getOwnedAttributes()));
      }

      return builder.items();
   }
}
