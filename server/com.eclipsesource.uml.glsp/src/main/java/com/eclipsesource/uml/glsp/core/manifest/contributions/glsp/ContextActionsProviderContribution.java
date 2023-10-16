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

import java.util.function.Consumer;

import org.eclipse.glsp.server.features.contextactions.ContextActionsProvider;

import com.eclipsesource.uml.modelserver.shared.manifest.supplier.ContributionBinderSupplier;
import com.google.inject.multibindings.Multibinder;

public interface ContextActionsProviderContribution extends ContributionBinderSupplier {

   default void contributeContextActionsProvider(
      final Consumer<Multibinder<ContextActionsProvider>> consumer) {
      consumer.accept(Multibinder.newSetBinder(contributionBinder(), ContextActionsProvider.class));
   }
}
