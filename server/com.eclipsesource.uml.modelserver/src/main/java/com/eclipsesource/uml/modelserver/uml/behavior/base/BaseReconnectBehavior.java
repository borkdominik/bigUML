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
package com.eclipsesource.uml.modelserver.uml.behavior.base;

import java.util.Set;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.ecore.EObject;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.registry.RepresentationKey;
import com.eclipsesource.uml.modelserver.uml.behavior.ReconnectBehavior;
import com.eclipsesource.uml.modelserver.uml.command.update.UpdateCommandProvider;
import com.eclipsesource.uml.modelserver.uml.command.update.UpdateCommandProviderRegistry;
import com.eclipsesource.uml.modelserver.uml.command.update.UpdateElementCommandContribution;
import com.google.inject.Inject;
import com.google.inject.TypeLiteral;

public abstract class BaseReconnectBehavior<TElement extends EObject> implements ReconnectBehavior<TElement> {
   @Inject
   protected TypeLiteral<TElement> type;
   @Inject
   protected UpdateCommandProviderRegistry updateRegistry;

   @Override
   public Class<? extends EObject> getElementType() { return (Class<? extends EObject>) type.getRawType(); }

   @Override
   public Command reconnect(final ModelContext context, final TElement element, final Set<String> sources,
      final Set<String> targets) {
      var argument = argument(context, element, sources, targets);
      var command = UpdateElementCommandContribution.create(context.representation(), element, argument);
      var reconnectContext = context.with().command(command).build();

      var provider = updateProviderFor(context, element);
      return provider.provideUpdateCommand(reconnectContext, element);
   }

   protected <T extends EObject> UpdateCommandProvider<T> updateProviderFor(final ModelContext context,
      final T element) {
      return (UpdateCommandProvider<T>) updateRegistry
         .access(new RepresentationKey<>(context.representation(), element.getClass()));
   }

   protected abstract Object argument(final ModelContext context, final TElement element,
      final Set<String> sources,
      final Set<String> targets);
}
