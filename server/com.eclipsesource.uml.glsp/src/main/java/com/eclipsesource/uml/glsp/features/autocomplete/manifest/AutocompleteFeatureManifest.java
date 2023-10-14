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
package com.eclipsesource.uml.glsp.features.autocomplete.manifest;

import com.eclipsesource.uml.glsp.core.manifest.FeatureManifest;
import com.eclipsesource.uml.glsp.core.manifest.contributions.glsp.ContextActionsProviderContribution;
import com.eclipsesource.uml.glsp.features.autocomplete.handler.action.AutocompleteContextActionsProvider;
import com.eclipsesource.uml.glsp.features.autocomplete.handler.action.DiagramAutocompleteEntriesRegistry;
import com.eclipsesource.uml.glsp.features.autocomplete.manifest.contributions.DiagramAutocompleteEntriesProviderContribution;
import com.google.inject.Singleton;

public class AutocompleteFeatureManifest extends FeatureManifest
   implements DiagramAutocompleteEntriesProviderContribution.Definition, ContextActionsProviderContribution {

   public static String ID = AutocompleteFeatureManifest.class.getSimpleName();

   @Override
   public String id() {
      return ID;
   }

   @Override
   protected void configure() {
      super.configure();

      contributeContextActionsProvider(contribution -> {
         contribution.addBinding().to(AutocompleteContextActionsProvider.class).in(Singleton.class);
      });

      defineAutocompleteEntriesProviderContribution();
      bind(DiagramAutocompleteEntriesRegistry.class).in(Singleton.class);

   }
}
