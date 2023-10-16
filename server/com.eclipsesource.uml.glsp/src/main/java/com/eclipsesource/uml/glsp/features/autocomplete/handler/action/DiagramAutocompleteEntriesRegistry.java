/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.features.autocomplete.handler.action;

import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.eclipse.glsp.server.types.EditorContext;

import com.eclipsesource.uml.glsp.features.autocomplete.provider.DiagramAutocompleteEntriesProvider;
import com.eclipsesource.uml.modelserver.shared.registry.DiagramSingleKeyRegistry;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;

public class DiagramAutocompleteEntriesRegistry
   extends DiagramSingleKeyRegistry<Set<DiagramAutocompleteEntriesProvider>> {

   @Inject
   public DiagramAutocompleteEntriesRegistry(
      final Map<Representation, Set<DiagramAutocompleteEntriesProvider>> providers) {
      providers.entrySet().forEach(e -> {
         var representation = e.getKey();

         register(representation, e.getValue());
      });

      // printContent();
   }

   public Set<DiagramAutocompleteEntriesProvider> getSupported(final Representation key,
      final EditorContext context) {
      return get(key).map(providers -> providers.stream().filter(p -> p.handles(context)).collect(Collectors.toSet()))
         .orElse(Set.of());
   }
}
