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
package com.borkdominik.big.glsp.uml.uml.elements.property.utils;

import java.util.List;
import java.util.stream.Collectors;

import org.eclipse.emf.common.util.EList;
import org.eclipse.glsp.server.emf.EMFIdGenerator;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.glsp.server.operations.DeleteOperation;
import org.eclipse.uml2.uml.Property;

import com.borkdominik.big.glsp.server.features.property_palette.model.ElementReferencePropertyItem;
import com.borkdominik.big.glsp.server.features.property_palette.provider.BGPropertyProviderContext;
import com.borkdominik.big.glsp.uml.uml.UMLTypes;
import com.borkdominik.big.glsp.uml.uml.elements.type.TypeUtils;

public class PropertyPropertyPaletteUtils {
   public static ElementReferencePropertyItem asReference(final BGPropertyProviderContext context,
      final String elementId, final String propertyId,
      final String label, final EList<Property> properties) {
      return ElementReferencePropertyItem.builder()
         .elementId(elementId)
         .propertyId(propertyId)
         .label(label)
         .references(asReferences(properties, context.idGenerator()))
         .creates(List.of(
            ElementReferencePropertyItem.CreateReference.builder()
               .label("Property")
               .action(
                  new CreateNodeOperation(UMLTypes.PROPERTY.prefix(context.representation()),
                     elementId))
               .build()))
         .build();
   }

   public static List<ElementReferencePropertyItem.Reference> asReferences(final List<Property> properties,
      final EMFIdGenerator idGenerator) {
      var references = properties.stream()
         .map(v -> {
            var label = v.getName() == null ? "Property" : v.getName();

            var association = v.getAssociation();
            if (association == null) {
               var id = idGenerator.getOrCreateId(v);
               return ElementReferencePropertyItem.Reference.builder()
                  .elementId(idGenerator.getOrCreateId(v))
                  .label(label)
                  .name(v.getName())
                  .hint(String.format("Type: %s", TypeUtils.name(v.getType())))
                  .deleteActions(List.of(new DeleteOperation(List.of(id))))
                  .build();
            }

            return ElementReferencePropertyItem.Reference.builder()
               .elementId(idGenerator.getOrCreateId(association))
               .label(label)
               .hint("Association")
               .build();
         })
         .collect(Collectors.toList());

      return references;
   }
}
