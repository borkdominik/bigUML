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
package com.eclipsesource.uml.glsp.uml.elements.operation.utils;

import java.util.List;
import java.util.stream.Collectors;

import org.eclipse.emf.common.util.EList;
import org.eclipse.glsp.server.emf.EMFIdGenerator;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.glsp.server.operations.DeleteOperation;
import org.eclipse.uml2.uml.Operation;

import com.eclipsesource.uml.glsp.features.property_palette.model.ElementReferencePropertyItem;
import com.eclipsesource.uml.glsp.uml.features.property_palette.RepresentationElementPropertyMapper;

public class OperationPropertyPaletteUtils {
   public static ElementReferencePropertyItem asReference(final RepresentationElementPropertyMapper<?> mapper,
      final String elementId, final Enum<?> propertyId,
      final String label, final EList<Operation> operations) {
      return new ElementReferencePropertyItem.Builder(elementId, propertyId.name())
         .label(label)
         .references(asReferences(operations, mapper.getIdGenerator()))
         .creates(List.of(
            new ElementReferencePropertyItem.CreateReference.Builder(
               "Operation",
               new CreateNodeOperation(mapper.configurationFor(Operation.class).typeId(),
                  elementId))
                     .build()))
         .build();
   }

   public static List<ElementReferencePropertyItem.Reference> asReferences(final List<Operation> operations,
      final EMFIdGenerator idGenerator) {
      var references = operations.stream()
         .map(v -> {
            var label = v.getName() == null ? "Operation" : v.getName();
            var id = idGenerator.getOrCreateId(v);
            return new ElementReferencePropertyItem.Reference.Builder(id, label)
               .name(v.getName())
               .deleteActions(List.of(new DeleteOperation(List.of(id))))
               .build();
         })
         .collect(Collectors.toList());

      return references;
   }
}
