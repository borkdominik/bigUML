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
package com.eclipsesource.uml.glsp.uml.elements.property.utils;

import java.util.List;
import java.util.stream.Collectors;

import org.eclipse.emf.common.util.EList;
import org.eclipse.glsp.server.emf.EMFIdGenerator;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.glsp.server.operations.DeleteOperation;
import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.glsp.features.property_palette.model.ElementReferencePropertyItem;
import com.eclipsesource.uml.glsp.uml.features.property_palette.RepresentationElementPropertyMapper;
import com.eclipsesource.uml.glsp.uml.utils.element.TypeUtils;

public class PropertyPropertyPaletteUtils {
   public static ElementReferencePropertyItem asReference(final RepresentationElementPropertyMapper<?> mapper,
      final String elementId, final Enum<?> propertyId,
      final String label, final EList<Property> properties) {
      return new ElementReferencePropertyItem.Builder(elementId, propertyId.name())
         .label(label)
         .references(asReferences(properties, mapper.getIdGenerator()))
         .creates(List.of(
            new ElementReferencePropertyItem.CreateReference.Builder(
               "Property",
               new CreateNodeOperation(mapper.configurationFor(Property.class).typeId(),
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
               return new ElementReferencePropertyItem.Reference.Builder(id, label)
                  .name(v.getName())
                  .hint(String.format("Type: %s", TypeUtils.name(v.getType())))
                  .deleteActions(List.of(new DeleteOperation(List.of(id))))
                  .build();
            }

            return new ElementReferencePropertyItem.Reference.Builder(idGenerator.getOrCreateId(association),
               label)
                  .hint("Association")
                  .build();
         })
         .collect(Collectors.toList());

      return references;
   }
}
