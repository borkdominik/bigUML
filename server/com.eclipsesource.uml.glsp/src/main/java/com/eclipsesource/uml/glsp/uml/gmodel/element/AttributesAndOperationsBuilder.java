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
package com.eclipsesource.uml.glsp.uml.gmodel.element;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.uml2.uml.Operation;
import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.glsp.core.gmodel.GModelMapHandler;
import com.eclipsesource.uml.glsp.core.gmodel.builder.CompartmentGBuilder;
import com.eclipsesource.uml.glsp.core.gmodel.builder.DividerGBuilder;

public interface AttributesAndOperationsBuilder extends CompartmentGBuilder, DividerGBuilder {
   default List<GModelElement> listOfAttributesAndOperations(final EObject source, final GModelMapHandler mapHandler,
      final List<Property> properties,
      final List<Operation> operations) {
      var entries = new ArrayList<GModelElement>();

      var filteredProperties = properties.stream()
         .filter(p -> p.getAssociation() == null)
         .collect(Collectors.toList());

      if (filteredProperties.size() > 0) {
         entries.add(buildDivider(source, "Attributes"));
         entries.addAll(filteredProperties.stream()
            .map(mapHandler::handle)
            .collect(Collectors.toList()));
      }

      if (operations.size() > 0) {
         entries.add(buildDivider(source, "Operations"));
         entries.addAll(operations.stream()
            .map(mapHandler::handle)
            .collect(Collectors.toList()));
      }

      return entries;
   }
}
