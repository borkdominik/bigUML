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
package com.eclipsesource.uml.glsp.uml.utils.element;

import java.util.List;
import java.util.stream.Collectors;

import org.eclipse.glsp.server.emf.EMFIdGenerator;
import org.eclipse.uml2.uml.Operation;

import com.eclipsesource.uml.glsp.features.property_palette.model.ElementReferencePropertyItem;

public class OperationUtils {
   public static List<ElementReferencePropertyItem.Reference> asReferences(final List<Operation> operations,
      final EMFIdGenerator idGenerator) {
      var references = operations.stream()
         .map(v -> {
            var label = v.getName() == null ? "Operation" : v.getName();
            return new ElementReferencePropertyItem.Reference(idGenerator.getOrCreateId(v), label, v.getName(), false);
         })
         .collect(Collectors.toList());

      return references;
   }
}
