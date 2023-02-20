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
package com.eclipsesource.uml.glsp.uml.utils;

import java.util.List;
import java.util.stream.Collectors;

import org.eclipse.glsp.server.emf.EMFIdGenerator;
import org.eclipse.uml2.uml.Parameter;

import com.eclipsesource.uml.glsp.features.property_palette.model.ElementReferencePropertyItem;

public class ParameterUtils {
   public static List<ElementReferencePropertyItem.Reference> asReferences(final List<Parameter> parameters,
      final EMFIdGenerator idGenerator) {
      var references = parameters.stream()
         .map(v -> {
            return new ElementReferencePropertyItem.Reference(asText(v), idGenerator.getOrCreateId(v), false);
         })
         .collect(Collectors.toList());

      return references;
   }

   public static String asText(final Parameter parameter) {
      var direction = parameter.getDirection().getLiteral();
      var name = parameter.getName();
      var type = TypeUtils.name(parameter.getType());

      return String.format("%s %s: %s", direction, name, type);
   }
}
