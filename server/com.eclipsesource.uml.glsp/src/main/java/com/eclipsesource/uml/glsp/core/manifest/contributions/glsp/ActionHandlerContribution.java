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

import org.eclipse.glsp.server.actions.ActionHandler;

import com.eclipsesource.uml.glsp.core.manifest.contributions.ContributionBinderSupplier;
import com.google.inject.multibindings.Multibinder;

public interface ActionHandlerContribution extends ContributionBinderSupplier {

   default void contributeActionHandlers(
      final Consumer<Multibinder<ActionHandler>> consumer) {
      consumer.accept(Multibinder.newSetBinder(contributionBinder(), ActionHandler.class));
   }
}
