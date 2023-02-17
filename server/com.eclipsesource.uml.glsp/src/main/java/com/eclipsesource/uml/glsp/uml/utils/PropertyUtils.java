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
import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.glsp.features.property_palette.model.ElementReferencePropertyItem;

public class PropertyUtils {
   public static List<ElementReferencePropertyItem.Reference> asReferences(final List<Property> properties,
      final EMFIdGenerator idGenerator) {
      var references = properties.stream()
         .map(v -> {
            var label = v.getName() == null ? "Property" : v.getName();
            return new ElementReferencePropertyItem.Reference(label, idGenerator.getOrCreateId(v));
         })
         .collect(Collectors.toList());

      return references;
   }
}
