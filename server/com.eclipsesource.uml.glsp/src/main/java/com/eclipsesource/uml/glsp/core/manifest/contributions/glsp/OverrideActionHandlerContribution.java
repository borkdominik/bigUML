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
package com.eclipsesource.uml.glsp.core.manifest.contributions.glsp;

import java.util.Set;
import java.util.function.Consumer;

import org.eclipse.glsp.server.actions.ActionHandler;

import com.eclipsesource.uml.modelserver.shared.manifest.supplier.ContributionBinderSupplier;
import com.eclipsesource.uml.modelserver.shared.manifest.supplier.ContributionIdSupplier;
import com.eclipsesource.uml.modelserver.shared.manifest.supplier.ContributionRepresentationSupplier;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Key;
import com.google.inject.TypeLiteral;
import com.google.inject.multibindings.MapBinder;
import com.google.inject.multibindings.Multibinder;

/*
 * Contributes to GLSP by replacing an operation handler provided by core for the specific diagram
 */
public interface OverrideActionHandlerContribution
   extends ContributionBinderSupplier, ContributionIdSupplier, ContributionRepresentationSupplier {

   interface Definition extends ContributionBinderSupplier {
      default void defineOverrideActionHandlerContribution() {
         var binder = contributionBinder();

         MapBinder.newMapBinder(binder, new TypeLiteral<Representation>() {},
            new TypeLiteral<Set<ActionHandler>>() {});
      }
   }

   default void contributeOverrideActionHandlers(
      final Consumer<Multibinder<ActionHandler>> consumer) {
      var binder = contributionBinder();

      var multibinder = Multibinder.newSetBinder(binder, new TypeLiteral<ActionHandler>() {}, idNamed());

      consumer.accept(multibinder);

      MapBinder.newMapBinder(binder, new TypeLiteral<Representation>() {},
         new TypeLiteral<Set<ActionHandler>>() {})
         .addBinding(representation())
         .to(Key.get(new TypeLiteral<Set<ActionHandler>>() {}, idNamed()));
   }
}
