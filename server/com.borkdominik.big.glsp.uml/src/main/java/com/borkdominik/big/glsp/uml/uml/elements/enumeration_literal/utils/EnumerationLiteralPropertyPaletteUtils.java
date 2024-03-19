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
package com.borkdominik.big.glsp.uml.uml.elements.enumeration_literal.utils;

import java.util.List;
import java.util.stream.Collectors;

import org.eclipse.emf.common.util.EList;
import org.eclipse.glsp.server.emf.EMFIdGenerator;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.glsp.server.operations.DeleteOperation;
import org.eclipse.uml2.uml.EnumerationLiteral;

import com.borkdominik.big.glsp.server.features.property_palette.model.ElementReferencePropertyItem;
import com.borkdominik.big.glsp.server.features.property_palette.provider.BGPropertyProviderContext;
import com.borkdominik.big.glsp.uml.uml.UMLTypes;

public class EnumerationLiteralPropertyPaletteUtils {
   public static ElementReferencePropertyItem asReference(final BGPropertyProviderContext context,
      final String elementId, final String propertyId,
      final String label, final EList<EnumerationLiteral> literals) {
      return ElementReferencePropertyItem.builder()
         .elementId(elementId)
         .propertyId(propertyId)
         .label(label)
         .references(asReferences(literals, context.idGenerator()))
         .creates(List.of(
            ElementReferencePropertyItem.CreateReference.builder()
               .label("Enumeration Literal")
               .action(
                  new CreateNodeOperation(UMLTypes.ENUMERATION_LITERAL.prefix(context.representation()),
                     elementId))
               .build()))
         .build();
   }

   public static List<ElementReferencePropertyItem.Reference> asReferences(final List<EnumerationLiteral> literals,
      final EMFIdGenerator idGenerator) {
      var references = literals.stream()
         .map(v -> {
            var id = idGenerator.getOrCreateId(v);
            var label = v.getName() == null ? "Enumeration Literal" : v.getName();
            return ElementReferencePropertyItem.Reference.builder()
               .elementId(idGenerator.getOrCreateId(v))
               .label(label)
               .name(v.getName())
               .deleteActions(List.of(new DeleteOperation(List.of(id))))
               .build();
         })
         .collect(Collectors.toList());

      return references;
   }
}
