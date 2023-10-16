/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.features.autocomplete.handler.action;

import java.util.List;
import java.util.stream.Collectors;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.eclipse.glsp.server.features.contextactions.ContextActionsProvider;
import org.eclipse.glsp.server.features.directediting.LabeledAction;
import org.eclipse.glsp.server.types.EditorContext;

import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.eclipsesource.uml.glsp.features.autocomplete.constants.AutocompleteConstants;
import com.google.inject.Inject;

public class AutocompleteContextActionsProvider implements ContextActionsProvider {
   private static Logger LOGGER = LogManager.getLogger(AutocompleteContextActionsProvider.class.getSimpleName());

   @Inject
   protected UmlModelState modelState;

   @Inject
   protected DiagramAutocompleteEntriesRegistry registry;

   @Override
   public String getContextId() { return AutocompleteConstants.CONTEXT_ID; }

   @Override
   public List<? extends LabeledAction> getActions(final EditorContext editorContext) {
      return modelState.getRepresentation().map(representation -> {

         var providers = registry.getSupported(representation, editorContext);

         return providers.stream().flatMap(p -> p.process(editorContext).stream()).collect(Collectors.toList());
      }).orElse(List.of());
   }

}
