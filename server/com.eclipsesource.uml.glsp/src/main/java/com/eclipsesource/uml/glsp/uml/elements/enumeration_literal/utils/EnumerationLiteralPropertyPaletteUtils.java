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
package com.eclipsesource.uml.glsp.uml.elements.enumeration_literal.utils;

import java.util.List;
import java.util.stream.Collectors;

import org.eclipse.emf.common.util.EList;
import org.eclipse.glsp.server.emf.EMFIdGenerator;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.uml2.uml.EnumerationLiteral;

import com.eclipsesource.uml.glsp.features.property_palette.model.ElementReferencePropertyItem;
import com.eclipsesource.uml.glsp.uml.features.property_palette.RepresentationElementPropertyMapper;

public class EnumerationLiteralPropertyPaletteUtils {
   public static ElementReferencePropertyItem asReference(final RepresentationElementPropertyMapper<?> mapper,
      final String elementId, final Enum<?> propertyId,
      final String label, final EList<EnumerationLiteral> literals) {
      return new ElementReferencePropertyItem.Builder(elementId, propertyId.name())
         .label(label)
         .references(asReferences(literals, mapper.getIdGenerator()))
         .creates(List.of(
            new ElementReferencePropertyItem.CreateReference.Builder(
               "Enumeration Literal",
               new CreateNodeOperation(mapper.configurationFor(EnumerationLiteral.class).typeId(),
                  elementId))
                     .build()))
         .build();
   }

   public static List<ElementReferencePropertyItem.Reference> asReferences(final List<EnumerationLiteral> literals,
      final EMFIdGenerator idGenerator) {
      var references = literals.stream()
         .map(v -> {
            var label = v.getName() == null ? "Enumeration Literal" : v.getName();
            return new ElementReferencePropertyItem.Reference.Builder(idGenerator.getOrCreateId(v), label)
               .name(v.getName()).build();
         })
         .collect(Collectors.toList());

      return references;
   }
}
