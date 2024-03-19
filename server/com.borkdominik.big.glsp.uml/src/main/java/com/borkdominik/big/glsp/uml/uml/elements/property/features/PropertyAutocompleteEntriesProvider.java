/********************************************************************************
 * Copyright (c) 2024 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.borkdominik.big.glsp.uml.uml.elements.property.features;

import java.util.List;
import java.util.stream.Collectors;

import org.eclipse.glsp.server.types.EditorContext;
import org.eclipse.uml2.uml.Property;

import com.borkdominik.big.glsp.server.features.autocomplete.handler.BGAutocompleteEntryAction;
import com.borkdominik.big.glsp.server.features.autocomplete.provider.integrations.BGEMFAutocompleteEntriesProvider;
import com.borkdominik.big.glsp.server.features.property_palette.handler.BGUpdateElementPropertyAction;
import com.borkdominik.big.glsp.uml.uml.elements.type.TypeInformationProvider;
import com.borkdominik.big.glsp.uml.uml.elements.typed_element.TypedElementPropertyProvider;
import com.google.inject.Inject;

public class PropertyAutocompleteEntriesProvider extends BGEMFAutocompleteEntriesProvider<Property> {

   @Inject
   protected TypeInformationProvider typeProvider;

   @Override
   public List<BGAutocompleteEntryAction> doProcess(final EditorContext context, final Property element) {
      var types = typeProvider.provide().stream()
         .map(information -> {
            var action = new BGUpdateElementPropertyAction(idGenerator.getOrCreateId(element),
               TypedElementPropertyProvider.TYPE, information.getId());

            return new BGAutocompleteEntryAction(information.getName(),
               List.of(action),
               information.getType());
         })
         .collect(Collectors.toList());

      var nullAction = new BGUpdateElementPropertyAction(idGenerator.getOrCreateId(element),
         TypedElementPropertyProvider.TYPE, null);

      types.add(0, new BGAutocompleteEntryAction("NULL",
         List.of(nullAction),
         "NULL"));
      return types;
   }

}
