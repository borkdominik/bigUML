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
package com.borkdominik.big.glsp.uml.uml.elements.parameter.utils;

import java.util.List;
import java.util.stream.Collectors;

import org.eclipse.emf.common.util.EList;
import org.eclipse.glsp.server.emf.EMFIdGenerator;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.glsp.server.operations.DeleteOperation;
import org.eclipse.uml2.uml.Parameter;

import com.borkdominik.big.glsp.server.features.property_palette.model.ElementReferencePropertyItem;
import com.borkdominik.big.glsp.server.features.property_palette.provider.BGPropertyProviderContext;
import com.borkdominik.big.glsp.uml.uml.UMLTypes;
import com.borkdominik.big.glsp.uml.uml.elements.type.TypeUtils;

public class ParameterPropertyPaletteUtils {
   public static ElementReferencePropertyItem asReference(final BGPropertyProviderContext context,
      final String elementId, final String propertyId,
      final String label, final EList<Parameter> parameters) {
      return ElementReferencePropertyItem.builder()
         .elementId(elementId)
         .propertyId(propertyId)
         .label(label)
         .isOrderable(true)
         .references(asReferences(parameters, context.idGenerator()))
         .creates(List.of(
            ElementReferencePropertyItem.CreateReference.builder()
               .label("Parameter")
               .action(
                  new CreateNodeOperation(UMLTypes.PARAMETER.prefix(context.representation()),
                     elementId))
               .build()))
         .build();
   }

   public static List<ElementReferencePropertyItem.Reference> asReferences(final List<Parameter> parameters,
      final EMFIdGenerator idGenerator) {
      var references = parameters.stream()
         .map(v -> {
            var id = idGenerator.getOrCreateId(v);
            return ElementReferencePropertyItem.Reference.builder()
               .elementId(idGenerator.getOrCreateId(v))
               .label(v.getLabel())
               .name(v.getName())
               .hint(asHint(v))
               .deleteActions(List.of(new DeleteOperation(List.of(id))))
               .build();
         })
         .collect(Collectors.toList());

      return references;
   }

   public static String asText(final Parameter parameter) {
      var direction = parameter.getDirection().getLiteral();
      var name = parameter.getName();
      var type = TypeUtils.asText(parameter.getType(), null, parameter);

      var label = direction + " " + name;

      if (type != null) {
         label += " " + type;
      }

      return label;
   }

   public static String asHint(final Parameter parameter) {
      var direction = parameter.getDirection().getLiteral();
      var type = TypeUtils.asText(parameter.getType(), parameter);

      var label = direction + " " + type;

      return label;
   }
}
